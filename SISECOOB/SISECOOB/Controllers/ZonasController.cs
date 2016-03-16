using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class ZonasController : Controller
    {
        // GET: Municipios
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string nombre, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Zonas> query = db.Zonas;

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(i => (i.Nombre).Contains(nombre));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Nombre)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.ZonaID,
                                 nombre = i.Nombre,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Zonas zon = db.Zonas.FirstOrDefault(i => i.ZonaID == id);
            Zonas z = new Zonas();

            if (zon != null)
            {
                z.ZonaID = zon.ZonaID;
                z.Nombre = zon.Nombre;
            }

            return PartialView("_Formulario", z);
        }

        [HttpPost]
        public JsonResult Create(Zonas zona)
        {
            try
            {
                zona.Crear();
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
        public JsonResult Edicion(Zonas zona)
        {
            try
            {
                zona.Editar();
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
                Zonas zona = new Zonas();
                zona.Eliminar(id);
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
