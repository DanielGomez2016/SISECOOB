using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class ContratistasController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string obra, string contratista, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Contratistas> query = db.Contratistas;

            if (!string.IsNullOrEmpty(contratista))
                query = query.Where(i => (i.Nombre).Contains(contratista));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Nombre)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.ContratistaID,
                                 nombre = i.Nombre,
                                 curp = i.CURP,
                                 rfc = i.RFC,
                                 vigencia = i.Vigencia.Value.ToString("yyyy/MM/dd"),
                                 email = i.Email
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Details(int id)
        {
            SISECOOBEntities db = new SISECOOBEntities();
            Contratistas con = db.Contratistas.FirstOrDefault(i => i.ContratistaID == id);
            con.telefonos = db.Telefonos.Where(i => i.Proveniente == "Contratista" && i.ProvenienteID == id).OrderBy(i => i.Telefono).Select(i => i.Telefono ).ToArray();
            con.tipotelefono = db.Telefonos.Where(i => i.Proveniente == "Contratista" && i.ProvenienteID == id).OrderBy(i => i.Telefono).Select(i => i.TipoTelefono.TipoTelefono1).ToArray();

            return PartialView("_Details", con);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Contratistas con = db.Contratistas.FirstOrDefault(i => i.ContratistaID == id);

            ViewBag.TipoTel = db.TipoTelefono.Select(i => new { id = i.TelefonoID, nombre = i.TipoTelefono1 }).OrderBy(i => i.nombre).ToList();

            Contratistas cont = new Contratistas();
            ViewBag.Telefonos = null;

            if (con != null)
            {
                cont.ContratistaID = con.ContratistaID;
                cont.Domicilio = con.Domicilio;
                cont.RFC = con.RFC;
                cont.CMIC = con.CMIC;
                cont.CURP = con.CURP;
                cont.Email = con.Email;
                cont.RPUC = con.RPUC;
                cont.Vigencia = con.Vigencia;
                cont.Capital = con.Capital;
                cont.Nombre = con.Nombre;
                cont.NumEstructura = con.NumEstructura;
                cont.Cargo = con.Cargo;
                cont.FechaRepleg = con.FechaRepleg;
                cont.NumNotario = con.NumNotario;
                cont.NomNotario = con.NomNotario;
                cont.Residencia = con.Residencia;
                cont.NumEscrituraActCons = con.NumEscrituraActCons;
                cont.Volumen = con.Volumen;
                cont.FechaActa = con.FechaActa;
                cont.NumNotarioActCons = con.NumNotarioActCons;
                cont.NomNotarioActCons = con.NomNotarioActCons;
                cont.ResidenciaActCons = con.ResidenciaActCons;
                cont.NumActa = con.NumActa;
                cont.FechaNacimiento = con.FechaNacimiento;
                cont.LugarNac = con.LugarNac;
                cont.LugarRegistro = con.LugarRegistro;
                cont.personafisica = con.personafisica;

                ViewBag.Telefonos = db.Telefonos.Where(i => i.Proveniente == "Contratista" && i.ProvenienteID == id).Select(i => new { tel = i.Telefono, tipo = i.TipoTelefono.TipoTelefono1 }).OrderBy(i => i.tel).ToList();

            }

            return PartialView("_Formulario", cont);
        }


        [HttpPost]
        public JsonResult Create(Contratistas contratista)
        {
            try
            {
                var cont = contratista.Crear();
                for (var i = 1; i < contratista.telefonos.Count(); i++)
                {
                    Telefonos t = new Telefonos();
                    t.Proveniente = "Contratista";
                    t.ProvenienteID = cont;
                    t.TipoTelefono_fk = Convert.ToInt32(contratista.tipotelefono[i]);
                    t.Telefono = contratista.telefonos[i];

                    t.Crear();
                }

                return Json(new
                {
                    result = true
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    result = false,
                    message = e.Message
                });
            }
        }

        [HttpPost]
        public JsonResult Edicion(Contratistas contratista)
        {
            try
            {
                var cont = contratista.Editar();

                SISECOOBEntities db = new SISECOOBEntities();
                List<Telefonos> t = db.Telefonos.Where(i => i.Proveniente == "Contratista" && i.ProvenienteID == cont).ToList();

                foreach (var i in t)
                {
                    db.Telefonos.DeleteObject(i);
                    db.SaveChanges();
                }


                for (var i = 1; i < contratista.telefonos.Count(); i++)
                {
                    Telefonos tel = new Telefonos();
                    tel.Proveniente = "Contratista";
                    tel.ProvenienteID = cont;
                    tel.TipoTelefono_fk = Convert.ToInt32(contratista.tipotelefono[i]);
                    tel.Telefono = contratista.telefonos[i];

                    tel.Crear();
                }

                return Json(new
                {
                    result = true
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    result = false,
                    message = e.Message
                });
            }
        }

        [HttpPost]
        public JsonResult Elimina(int id = 0)
        {
            try
            {
                Contratistas cont = new Contratistas();
                cont.Eliminar(id);
                return Json(new
                {
                    result = true
                });
            }
            catch (Exception e)
            {
                return Json(new
                {
                    result = false,
                    message = e.Message
                });
            }
        }

        public JsonResult telefonos(int id)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Telefonos> query = db.Telefonos.Where(i => i.Proveniente == "Contratista" && i.ProvenienteID == id);

            return Json(new
            {
                total = query.Count(),
                op = db.TipoTelefono.Select(i => new { id = i.TelefonoID, tipo = i.TipoTelefono1 }).ToList(),
                datos = query.Select(i => new
                {
                    tel = i.Telefono,
                    tipo = i.TipoTelefono.TipoTelefono1,
                })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }
    }
}