import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 30, borderBottom: 1, paddingBottom: 10, borderColor: '#059669' },
  title: { fontSize: 24, color: '#059669', fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 5 },
  sectionTitle: { fontSize: 18, color: '#0f172a', marginTop: 20, marginBottom: 10, borderBottom: 1, borderColor: '#e2e8f0' },
  row: { flexDirection: 'row', borderBottom: 1, borderColor: '#f1f5f9', paddingVertical: 8 },
  cellHeader: { width: '33%', fontSize: 12, fontWeight: 'bold', color: '#475569' },
  cell: { width: '33%', fontSize: 12, color: '#0f172a' },
  totalBox: { marginTop: 20, padding: 15, backgroundColor: '#f0fdf4', borderRadius: 4 },
  totalText: { fontSize: 16, color: '#166534', fontWeight: 'bold' }
});

export const ImpactReportPDF = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>TerraCRM Institucional</Text>
        <Text style={styles.subtitle}>Reporte Consolidado de Finanzas e Impacto Ecológico</Text>
        <Text style={styles.subtitle}>Fecha de emisión: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Fondo Total Recaudado: ${data.totalRaised.toFixed(2)} USD</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Resumen de Donaciones Recientes</Text>
        <View style={styles.row}>
          <Text style={styles.cellHeader}>Donante</Text>
          <Text style={styles.cellHeader}>Monto</Text>
          <Text style={styles.cellHeader}>Fecha</Text>
        </View>
        {data.donations.slice(0, 10).map((d: any) => (
          <View style={styles.row} key={d.id}>
            <Text style={styles.cell}>{d.donorName}</Text>
            <Text style={styles.cell}>${d.amount}</Text>
            <Text style={styles.cell}>{new Date(d.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </View>

      <View>
        <Text style={styles.sectionTitle}>Métricas Globales de Impacto</Text>
        {data.definitions.map((def: any) => {
          const total = data.metrics
            .filter((m: any) => m.metricId === def.id)
            .reduce((sum: number, m: any) => sum + m.value, 0);
            
          return total > 0 ? (
            <View style={styles.row} key={def.id}>
              <Text style={{ width: '50%', fontSize: 12 }}>{def.name}</Text>
              <Text style={{ width: '50%', fontSize: 12, fontWeight: 'bold' }}>{total} {def.unit}</Text>
            </View>
          ) : null;
        })}
      </View>

      <Text style={{ position: 'absolute', bottom: 30, left: 40, fontSize: 10, color: '#94a3b8' }}>
        Generado automáticamente por TerraCRM. Confidencial.
      </Text>
    </Page>
  </Document>
);
