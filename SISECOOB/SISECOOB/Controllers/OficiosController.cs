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

        public JsonResult Buscar(string oficio, string fechaoficio, string fecharecibo, int tipooficio = 0, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Oficios> query = db.Oficios;

            if (!string.IsNullOrEmpty(oficio))
                query = query.Where(i => (i.OficioID).Contains(oficio));
            if (tipooficio > 0)
                query = query.Where(i => i.TipoOficio_Fk == tipooficio);
            if (fecharecibo != null)
                query = query.Where(i => i.FechaRecibo.Value.ToString("yyyy/MM/dd") == fecharecibo);
            if (fechaoficio != null)
                query = query.Where(i => i.FechaOficio.Value.ToString("yyyy/MM/dd") == fechaoficio);

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
                var of = oficio.Crear();

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

    }
}