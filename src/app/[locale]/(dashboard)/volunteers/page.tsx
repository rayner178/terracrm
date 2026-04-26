import { fetchVolunteers, createVolunteerAction } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function VolunteersPage() {
  const result = await fetchVolunteers();
  const volunteers = result.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">Voluntarios</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Añadir Nuevo Voluntario</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createVolunteerAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Nombre</label>
                <Input name="firstName" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Apellidos</label>
                <Input name="lastName" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <Input name="email" type="email" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Teléfono</label>
                <Input name="phone" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Habilidades</label>
                <Input name="skills" placeholder="Ej: Diseño, Biología..." className="bg-slate-50" />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">Guardar Voluntario</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Directorio de Voluntarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Habilidades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-slate-500 py-8">
                        No hay voluntarios registrados aún.
                      </TableCell>
                    </TableRow>
                  )}
                  {volunteers.map((vol) => (
                    <TableRow key={vol.id}>
                      <TableCell className="font-medium text-slate-800">{vol.firstName} {vol.lastName}</TableCell>
                      <TableCell className="text-slate-600">{vol.email}</TableCell>
                      <TableCell className="text-slate-600">
                        {vol.skills ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            {vol.skills}
                          </span>
                        ) : "-"}
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
