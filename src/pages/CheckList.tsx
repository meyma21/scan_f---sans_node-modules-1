import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, RefreshCw, Check, X } from 'lucide-react';
import { useCheckStore } from '../store/checkStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CheckImageViewer from '../components/check/CheckImageViewer';
import CheckDetailPanel from '../components/check/CheckDetailPanel';
import { formatCurrency } from '../utils/formatters';
import { CheckData, ANOMALY_COLORS } from '../types/index';
import { useSimulatorControl } from '../context/SimulatorControlContext';

const getCheckRowColor = (check: CheckData) => {
  if (!check.anomalies || check.anomalies.length === 0) {
    return 'bg-green-100 text-green-800';
  }
  
  // Get the highest severity anomaly
  const highestSeverityAnomaly = check.anomalies.reduce((highest, current) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[current.severity] > severityOrder[highest.severity] ? current : highest;
  }, check.anomalies[0]);
  
  return ANOMALY_COLORS[highestSeverityAnomaly.type];
};

// New component for detailed check information
const CheckDetailsTable: React.FC<{ check: CheckData }> = ({ check }) => {
  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold mb-3">Informations Détaillées du Chèque</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Numéro de Chèque</td>
              <td className="px-4 py-2">{check.checkNumber}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Montant</td>
              <td className="px-4 py-2">{formatCurrency(check.amount)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Montant en Lettres</td>
              <td className="px-4 py-2">{check.amountInWords}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Bénéficiaire</td>
              <td className="px-4 py-2">{check.payee.name}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Émetteur</td>
              <td className="px-4 py-2">{check.issuer.name}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Date</td>
              <td className="px-4 py-2">{new Date(check.date).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Banque</td>
              <td className="px-4 py-2">{check.bankDetails.bankName}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Code Banque</td>
              <td className="px-4 py-2">{check.bankDetails.bankCode}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Code Agence</td>
              <td className="px-4 py-2">{check.bankDetails.branchCode}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Numéro de Compte</td>
              <td className="px-4 py-2">{check.bankDetails.accountNumber}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Clé RIB</td>
              <td className="px-4 py-2">{check.bankDetails.ribKey}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Statut</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${check.status === 'validated' ? 'bg-green-100 text-green-800' :
                    check.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    check.status === 'needs_review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {check.status === 'validated' ? 'Validé' :
                   check.status === 'rejected' ? 'Rejeté' :
                   check.status === 'needs_review' ? 'À Vérifier' :
                   'En Attente'}
                </span>
              </td>
            </tr>
            {check.memo && (
              <tr>
                <td className="px-4 py-2 font-medium text-gray-500">Mémo</td>
                <td className="px-4 py-2">{check.memo}</td>
              </tr>
            )}
            <tr>
              <td className="px-4 py-2 font-medium text-gray-500">Caractéristiques de Sécurité</td>
              <td className="px-4 py-2">
                <ul className="list-disc list-inside">
                  {check.securityFeatures.hasWatermark && <li>Filigrane</li>}
                  {check.securityFeatures.hasMicrotext && <li>Microtexte</li>}
                  {check.securityFeatures.hasUVFeatures && <li>Caractéristiques UV</li>}
                </ul>
              </td>
            </tr>
            {check.verificationDetails && (
              <>
                <tr>
                  <td className="px-4 py-2 font-medium text-gray-500">Vérifié le</td>
                  <td className="px-4 py-2">
                    {check.verificationDetails.verifiedAt ? 
                      new Date(check.verificationDetails.verifiedAt).toLocaleString() : 
                      'Non vérifié'}
                  </td>
                </tr>
                {check.verificationDetails.verifiedBy && (
                  <tr>
                    <td className="px-4 py-2 font-medium text-gray-500">Vérifié par</td>
                    <td className="px-4 py-2">{check.verificationDetails.verifiedBy}</td>
                  </tr>
                )}
                {check.verificationDetails.notes && (
                  <tr>
                    <td className="px-4 py-2 font-medium text-gray-500">Notes</td>
                    <td className="px-4 py-2">{check.verificationDetails.notes}</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CheckList: React.FC = () => {
  const navigate = useNavigate();
  const { checks, fetchChecks, selectCheck, isLoading, validateCheck, validateAllChecks } = useCheckStore();
  const validatedChecks = useCheckStore(state => state.validatedChecks);
  const rejectedChecks = useCheckStore(state => state.rejectedChecks);
  const [selectedCheck, setSelectedCheck] = useState<CheckData | null>(null);
  const { sendCommand } = useSimulatorControl();

  const handleScan = () => {
    try {
      sendCommand('SCAN');
    } catch (error) {
      console.error('Error scanning check:', error);
    }
  };

  const handleReset = () => {
    setSelectedCheck(null);
  };

  const handleDelete = async (id: string) => {
    await useCheckStore.getState().deleteCheck(id);
    // If the deleted check was the selected one, deselect it
    if (selectedCheck?.id === id) {
      setSelectedCheck(null);
    }
  };

  const handleValidateSingleCheck = async (id: string) => {
    await validateCheck(id);
  };

  const handleRejectCheck = async (id: string) => {
    await useCheckStore.getState().rejectCheck(id);
  };

  const handleValidateAllChecks = async () => {
    await validateAllChecks();
  };

  const totalAmount = checks.reduce((sum, check) => sum + (check.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
          
          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-8 space-y-6">
            {selectedCheck ? (
              <Card className="bg-white shadow-sm h-full rounded-lg">
                <div className="h-full flex flex-col">
                  <div className="flex justify-between items-center border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">Détails du Chèque</h3>
                    <div className="flex gap-1 pr-3 pt-1 pb-1">
                      <Button
                        variant="error"
                        size="xs"
                        onClick={() => handleDelete(selectedCheck.id)}
                        className="px-3 py-1.5 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="error"
                        size="xs"
                        onClick={() => handleRejectCheck(selectedCheck.id)}
                        className="px-3 py-1.5 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() => handleValidateSingleCheck(selectedCheck.id)}
                        className="px-3 py-1.5"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow">
                    <div className="lg:col-span-1 rounded-none overflow-hidden">
                      <CheckImageViewer images={selectedCheck.images} />
                    </div>
                    <div className="lg:col-span-1 rounded-none overflow-hidden">
                      <CheckDetailPanel check={selectedCheck} />
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <CheckDetailsTable check={selectedCheck} />
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-12 bg-white shadow-sm rounded-lg">
                <div className="text-gray-500">
                  <p className="text-lg">Aucun chèque sélectionné</p>
                  <p className="mt-2">Cliquez sur un chèque dans la liste pour voir ses détails</p>
                </div>
              </div>
            )}
          </div>
  
          {/* Sidebar */}
          <div className="col-span-1 lg:col-span-4 space-y-6">
            {/* Summary Card */}
            <Card className="bg-white shadow-sm rounded-lg">
              <div className="p-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Remises Client</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nb Chèques Numérisés</span>
                    <span className="font-semibold text-gray-900">{checks.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Montant Total</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
                {/* Scan and Reset Buttons */}
                <div className="flex gap-1 mt-1 border-t border-gray-200 pt-1">
                  <Button
                    variant="primary"
                    onClick={handleScan}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white text-xs py-0.5 px-2 rounded"
                    disabled={isLoading}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {isLoading ? 'Numérisation en cours...' : 'Numériser'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 text-xs py-0.5 px-2 rounded-none"
                    disabled={isLoading}
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Remise à zéro
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleValidateAllChecks}
                    className="w-full text-xs py-0.5 px-2 rounded mt-1 lg:mt-0"
                    disabled={checks.length === 0}
                  >
                    <Check className="h-5 w-5 mr-2" />
                    Valider tous les chèques
                  </Button>
                </div>
              </div>
            </Card>
  
            {/* Checks List */}
            <Card className="bg-white shadow-sm rounded-lg">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des Chèques</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {checks.map((check) => (
                        <tr
                          key={check.id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            selectedCheck?.id === check.id ? 'bg-primary-50' :
                            getCheckRowColor(check)
                          }`}
                          onClick={() => setSelectedCheck(check)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-12 flex-shrink-0">
                                <img className="h-8 w-12 object-cover shadow-sm rounded" src={check.images[0]?.url} alt={`Chèque ${check.checkNumber}`} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{check.checkNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(check.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
  
            {/* Validated Checks List */}
            <Card className="bg-white shadow-sm rounded-lg mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des Chèques validés</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {validatedChecks.map((check) => (
                        <tr
                          key={check.id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            selectedCheck?.id === check.id ? 'bg-primary-50' :
                            getCheckRowColor(check)
                          }`}
                          onClick={() => setSelectedCheck(check)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-12 flex-shrink-0">
                                <img className="h-8 w-12 object-cover shadow-sm rounded" src={check.images[0]?.url} alt={`Chèque ${check.checkNumber}`} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{check.checkNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(check.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* Rejected Checks List */}
            <Card className="bg-white shadow-sm rounded-lg mt-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des Chèques rejetés</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rejectedChecks.map((check) => (
                        <tr
                          key={check.id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                            selectedCheck?.id === check.id ? 'bg-primary-50' :
                            getCheckRowColor(check)
                          }`}
                          onClick={() => setSelectedCheck(check)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-12 flex-shrink-0">
                                <img className="h-8 w-12 object-cover shadow-sm rounded" src={check.images[0]?.url} alt={`Chèque ${check.checkNumber}`} />
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{check.checkNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(check.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckList;