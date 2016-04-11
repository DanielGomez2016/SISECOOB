using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class TipoEstructurasController : Controller
    {
        // GET: TipoEstructuras
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string estructura, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<TipoEstructura> query = db.TipoEstructura;

            if (!string.IsNullOrEmpty(estructura))
                query = query.Where(i => (i.TipoEstructura1).Contains(estructura));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.TipoEstructura1)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.EstructuraID,
                                 nombre = i.TipoEstructura1,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            TipoEstructura te = db.TipoEstructura.FirstOrDefault(i => i.EstructuraID == id);
            TipoEstructura t = new TipoEstructura();

            if (te != null)
            {
                t.EstructuraID = te.EstructuraID;
                t.TipoEstructura1 = te.TipoEstructura1;
            }

            return PartialView("_Formulario", t);
        }

        [HttpPost]
        public JsonResult Create(TipoEstructura te)
        {
            try
            {
                te.Crear();
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
        public JsonResult Edicion(TipoEstructura te)
        {
            try
            {
                te.Editar();
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
                TipoEstructura te = new TipoEstructura();
                te.Eliminar(id);
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