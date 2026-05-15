import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10, borderColor: '#059669' },
  title: { fontSize: 24, color: '#059669', fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#64748b', marginTop: 5 },
  sectionTitle: { fontSize: 16, color: '#0f172a', marginTop: 20, marginBottom: 10, borderBottom: 1, borderColor: '#e2e8f0', paddingBottom: 4 },
  row: { flexDirection: 'row', borderBottom: 1, borderColor: '#f1f5f9', paddingVertical: 6 },
  cellHeader: { width: '50%', fontSize: 10, fontWeight: 'bold', color: '#475569' },
  cell: { width: '50%', fontSize: 10, color: '#0f172a' },
  cellHeaderWide: { width: '70%', fontSize: 10, fontWeight: 'bold', color: '#475569' },
  cellWide: { width: '70%', fontSize: 10, color: '#0f172a' },
  cellHeaderNarrow: { width: '30%', fontSize: 10, fontWeight: 'bold', color: '#475569' },
  cellNarrow: { width: '30%', fontSize: 10, color: '#0f172a' },
  summaryBox: { marginTop: 10, padding: 15, backgroundColor: '#f8fafc', borderRadius: 4 },
  summaryText: { fontSize: 12, color: '#334155', marginBottom: 4 }
});

export const ProjectReportPDF = ({ project }: { project: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>
        {project.location && <Text style={styles.subtitle}>Ubicación: {project.location}</Text>}
        <Text style={styles.subtitle}>
          Estado: {project.status === 'COMPLETED' ? 'Completado' : project.status === 'ACTIVE' ? 'Activo' : 'En Planificación'}
        </Text>
      </View>

      <View style={styles.summaryBox}>
        {project.description && <Text style={styles.summaryText}>{project.description}</Text>}
        <Text style={styles.summaryText}>Presupuesto: ${project.budget?.toFixed(2) || '0.00'}</Text>
        <Text style={styles.summaryText}>Ejecutado: ${project.spent?.toFixed(2) || '0.00'}</Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Métricas de Impacto</Text>
        {project.metricRecords?.length === 0 ? (
          <Text style={{ fontSize: 10, color: '#94a3b8' }}>Sin métricas registradas</Text>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.cellHeader}>Métrica</Text>
              <Text style={styles.cellHeader}>Valor</Text>
            </View>
            {project.metricRecords?.map((m: any) => (
              <View style={styles.row} key={m.id}>
                <Text style={styles.cell}>{m.metric?.name}</Text>
                <Text style={styles.cell}>{m.value} {m.metric?.unit}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      <View>
        <Text style={styles.sectionTitle}>Hitos y Entregables</Text>
        {project.milestones?.length === 0 ? (
          <Text style={{ fontSize: 10, color: '#94a3b8' }}>Sin hitos registrados</Text>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.cellHeaderWide}>Título</Text>
              <Text style={styles.cellHeaderNarrow}>Estado</Text>
            </View>
            {project.milestones?.map((m: any) => (
              <View style={styles.row} key={m.id}>
                <Text style={styles.cellWide}>{m.title}</Text>
                <Text style={styles.cellNarrow}>{m.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}</Text>
              </View>
            ))}
          </>
        )}
      </View>

      <View>
        <Text style={styles.sectionTitle}>Aliados y Voluntarios Asignados</Text>
        {project.assignments?.length === 0 ? (
          <Text style={{ fontSize: 10, color: '#94a3b8' }}>Sin aliados asignados</Text>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.cellHeaderWide}>Nombre</Text>
              <Text style={styles.cellHeaderNarrow}>Horas Dedicadas</Text>
            </View>
            {project.assignments?.map((a: any) => (
              <View style={styles.row} key={a.id}>
                <Text style={styles.cellWide}>{a.volunteer?.firstName} {a.volunteer?.lastName}</Text>
                <Text style={styles.cellNarrow}>{a.hoursWorked}h</Text>
              </View>
            ))}
          </>
        )}
      </View>

      <Text style={{ position: 'absolute', bottom: 30, left: 40, fontSize: 10, color: '#94a3b8' }}>
        Generado automáticamente por TerraCRM. Confidencial.
      </Text>
    </Page>
  </Document>
);
