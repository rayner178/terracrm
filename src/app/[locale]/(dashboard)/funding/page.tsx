import { fetchDonations, fetchActiveProjects, createDonationAction } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function FundingPage() {
  const donations = await fetchDonations() as any[];
  const projects = await fetchActiveProjects();

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Donaciones y Fondos</h2>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md font-semibold text-lg border border-emerald-100">
          Total Recaudado: ${totalRaised.toLocaleString('en-US')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-0 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Registrar Donación</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createDonationAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nombre del Donante o Institución</label>
                <Input name="donorName" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Monto ($)</label>
                <Input name="amount" type="number" step="0.01" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Asignar a Proyecto (Opcional)</label>
                <select name="projectId" className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm">
                  <option value="">Fondo General</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Registrar Ingreso</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Historial de Donaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Donante</TableHead>
                    <TableHead>Proyecto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                        No hay donaciones registradas aún.
                      </TableCell>
                    </TableRow>
                  )}
                  {donations.map((don) => (
                    <TableRow key={don.id}>
                      <TableCell className="text-slate-500 text-sm">
                         {new Date(don.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-slate-800">{don.donorName}</TableCell>
                      <TableCell className="text-slate-600">
                        {don.project ? (
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{don.project.name}</span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">General</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-emerald-600">
                         ${don.amount.toLocaleString('en-US')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
