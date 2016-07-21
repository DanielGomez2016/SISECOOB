using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class OficiosController : Controller
    {
        public ActionResult Index()
        {
            SISECOOBEntities db = new SISECOOBEntities();
            ViewBag.TipoOficio = db.TipoOficios.Select(i => new { id = i.TipoOficioID, nombre = i.Nombre }).OrderBy(i => i.nombre).ToList();
            return View();
        }

        public JsonResult Buscar(string oficio, DateTime? fechaoficio, DateTime? fecharecibo, int tipooficio = 0, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Oficios> query = db.Oficios;

            if (!string.IsNullOrEmpty(oficio))
                query = query.Where(i => (i.OficioID).Contains(oficio));
            if (tipooficio > 0)
                query = query.Where(i => i.TipoOficio_Fk == tipooficio);
            if (fecharecibo != null)
                query = query.Where(i => i.FechaRecibo >= fecharecibo);
            if (fechaoficio != null)
                query = query.Where(i => i.FechaOficio >= fechaoficio);

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.OficioID)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.OficioID,
                                 tipo = i.TipoOficios.Nombre,
                                 recibido = i.Recibido,
                                 fechaoficio = i.FechaOficio.Value.ToString("yyyy/MM/dd"),
                                 fecharecibo = i.FechaRecibo.Value.ToString("yyyy/MM/dd"), 
                                 programa = i.Programas.Programa,
                                 asunto = i.Asunto,
                                 desc = i.Descripcion,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Details(string id)
        {
            SISECOOBEntities db = new SISECOOBEntities();
            Oficios of = db.Oficios.FirstOrDefault(i => i.OficioID == id);
            
            return PartialView("_Details", of);
        }

        [HttpPost]
        public ActionResult Formulario(string id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Oficios ofi = db.Oficios.FirstOrDefault(i => i.OficioID == id);

            ViewBag.TipoOficio = db.TipoOficios.Select(i => new { id = i.TipoOficioID, nombre = i.Nombre }).OrderBy(i => i.nombre).ToList();
            ViewBag.Programa = db.Programas.Select(i => new { id = i.ProgramaID, nombre = i.Programa }).OrderBy(i => i.nombre).ToList();
            ViewBag.TipoCuenta = db.TiposCuentas.Select(i => new { id = i.TipoCuentaID, nombre = i.TipoCuenta }).OrderBy(i => i.nombre).ToList();

            Oficios ofis = new Oficios();

            if (ofi != null)
            {
                ofis.OficioID = ofi.OficioID;
                ofis.ProgramaID_Fk = ofi.ProgramaID_Fk;
                ofis.TipoOficio_Fk = ofi.TipoOficio_Fk;
                ofis.Recibido = ofi.Recibido;
                ofis.FechaOficio = ofi.FechaOficio;
                ofis.FechaRecibo = ofi.FechaRecibo;
                ofis.Asunto = ofi.Asunto;
                ofis.Descripcion = ofi.Descripcion;
            }

            return PartialView("_Formulario", ofis);
        }


        [HttpPost]
        public JsonResult Create(Oficios oficio)
        {
            try
            {
                var ofi = oficio.Crear();
                for (var i = 1; i < oficio.cuentas.Count(); i++)
                {
                    OficiosCuentas oc = new OficiosCuentas();
                    oc.OficioID_Fk = ofi;
                    oc.TipoCuentaID = Convert.ToInt32(oficio.tiposcuentas[i]);
                    oc.Cuenta = oficio.cuentas[i];
                    oc.Monto = Convert.ToInt32(oficio.montos[i]);

                    oc.Crear();
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
        public JsonResult Edicion(Oficios oficio)
        {
            try
            {
                var of = oficio.Editar();

                SISECOOBEntities db = new SISECOOBEntities();
                List<OficiosCuentas> t = db.OficiosCuentas.Where(i => i.OficioID_Fk == oficio.OficioID).ToList();

                foreach (var i in t)
                {
                    db.OficiosCuentas.DeleteObject(i);
                    db.SaveChanges();
                }


                for (var i = 1; i < oficio.cuentas.Count(); i++)
                {
                    OficiosCuentas oc = new OficiosCuentas();
                    oc.OficioID_Fk = of;
                    oc.TipoCuentaID = Convert.ToInt32(oficio.tiposcuentas[i]);
                    oc.Cuenta = oficio.cuentas[i];
                    oc.Monto = Convert.ToInt32(oficio.montos[i]);

                    oc.Crear();
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
        public JsonResult Elimina(string id)
        {
            try
            {
                Oficios of = new Oficios();
                of.Eliminar(id);
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

        public JsonResult Cuentas(string id)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<OficiosCuentas> query = db.OficiosCuentas.Where(i => i.OficioID_Fk == id);

            return Json(new
            {
                total = query.Count(),
                tc = db.TiposCuentas.Select(i => new { id = i.TipoCuentaID, tipo = i.TipoCuenta }).ToList(),
                datos = query.Select(i => new
                {
                    id = i.OficioID_Fk,
                    tipocuenta = i.TipoCuentaID,
                    cuenta = i.Cuenta,
                    monto = i.Monto,
        })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

    }
}