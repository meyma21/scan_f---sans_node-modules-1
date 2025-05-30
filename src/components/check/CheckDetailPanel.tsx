import React from 'react';
import { formatCurrency, formatDate, formatAccountNumber, formatRIB } from '../../utils/formatters';
import { CheckData, ANOMALY_COLORS } from '../../types/index';
import Card, { CardHeader, CardBody } from '../ui/Card';

interface CheckDetailPanelProps {
  check: CheckData;
}

const CheckDetailPanel: React.FC<CheckDetailPanelProps> = ({ check }) => {
  return (
    <Card className="h-full rounded-none">
      <CardHeader 
        title="Détails du Chèque" 
        subtitle="Informations bancaires et routage"
      />
      <CardBody>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Anomalies Détectées</h4>
            <ul className="text-sm space-y-1">
              {check.anomalies && check.anomalies.length > 0 ? (
                check.anomalies.map((anomaly, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ANOMALY_COLORS[anomaly.type]}`}>
                      {anomaly.message}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-green-600">Aucune anomalie détectée</li>
              )}
            </ul>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Numéro du Chèque</h4>
              <p className="text-lg font-semibold">#{check.checkNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Montant</h4>
              <p className="text-lg font-semibold text-primary-700">{formatCurrency(check.amount)}</p>
              <p className="text-sm text-gray-600">{check.amountInWords}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Bénéficiaire</h4>
            <p className="text-base">{check.payee.name}</p>
            {check.payee.identifier && (
              <p className="text-sm text-gray-500">ID: {check.payee.identifier}</p>
            )}
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Banque Émettrice</h4>
            <p className="text-base">{check.issuer.name}</p>
            <p className="text-sm text-gray-600">{check.issuer.address}</p>
            <p className="text-sm text-gray-600">Tél: {check.issuer.phone}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Coordonnées Bancaires</h4>
            <p className="text-base font-mono">
              RIB: {formatRIB(check.bankDetails)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Date d'Émission</h4>
              <p className="text-base">{formatDate(check.date)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Date de Numérisation</h4>
              <p className="text-base">{formatDate(check.createdAt)}</p>
            </div>
          </div>
          
          {check.memo && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Mention</h4>
              <p className="text-base">{check.memo}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Éléments de Sécurité</h4>
            <ul className="text-sm space-y-1">
              {check.securityFeatures.hasWatermark && (
                <li className="text-success-600">✓ Filigrane</li>
              )}
              {check.securityFeatures.hasMicrotext && (
                <li className="text-success-600">✓ Micro-impression</li>
              )}
              {check.securityFeatures.hasUVFeatures && (
                <li className="text-success-600">✓ Éléments UV</li>
              )}
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CheckDetailPanel;