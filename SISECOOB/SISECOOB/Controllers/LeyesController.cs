using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class LeyesController : Controller
    {
        // GET: Leyes
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string ley, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Leyes> query = db.Leyes;

            if (!string.IsNullOrEmpty(ley))
                query = query.Where(i => (i.Ley).Contains(ley));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Ley)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.LeyesID,
                                 nombre = i.Ley,
                                 desc = i.Descripcion,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Leyes ley = db.Leyes.FirstOrDefault(i => i.LeyesID == id);
            Leyes l = new Leyes();

            if (ley != null)
            {
                l.LeyesID = ley.LeyesID;
                l.Ley = ley.Ley;
                l.Descripcion = ley.Descripcion;
            }

            return PartialView("_Formulario", l);
        }

        [HttpPost]
        public JsonResult Create(Leyes l)
        {
            try
            {
                l.Crear();
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
        public JsonResult Edicion(Leyes l)
        {
            try
            {
                l.Editar();
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
                Leyes ley = new Leyes();
                ley.Eliminar(id);
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