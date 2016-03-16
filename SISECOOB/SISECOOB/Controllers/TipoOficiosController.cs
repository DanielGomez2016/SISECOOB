using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class TipoOficiosController : Controller
    {
        // GET: Municipios
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string nombre, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<TipoOficios> query = db.TipoOficios;

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
                                 id = i.TipoOficioID,
                                 nombre = i.Nombre,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            TipoOficios tip = db.TipoOficios.FirstOrDefault(i => i.TipoOficioID == id);
            TipoOficios t = new TipoOficios();

            if (tip != null)
            {
                t.TipoOficioID = tip.TipoOficioID;
                t.Nombre = tip.Nombre;
            }

            return PartialView("_Formulario", t);
        }

        [HttpPost]
        public JsonResult Create(TipoOficios tipos)
        {
            try
            {
                tipos.Crear();
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
        public JsonResult Edicion(TipoOficios tipos)
        {
            try
            {
                tipos.Editar();
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
                TipoOficios tipos = new TipoOficios();
                tipos.Eliminar(id);
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
