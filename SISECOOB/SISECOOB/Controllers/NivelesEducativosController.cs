using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class NivelesEducativosController : Controller
    {
        // GET: Municipios
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string nombre, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<NivelesEducativos> query = db.NivelesEducativos;

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
                                 id = i.NivelID,
                                 nombre = i.Nombre,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            NivelesEducativos niv = db.NivelesEducativos.FirstOrDefault(i => i.NivelID == id);
            NivelesEducativos n = new NivelesEducativos();

            if (niv != null)
            {
                n.NivelID = niv.NivelID;
                n.Nombre = niv.Nombre;
            }

            return PartialView("_Formulario", n);
        }

        [HttpPost]
        public JsonResult Create(NivelesEducativos niveles)
        {
            try
            {
                niveles.Crear();
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
        public JsonResult Edicion(NivelesEducativos niveles)
        {
            try
            {
                niveles.Editar();
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
                NivelesEducativos niveles = new NivelesEducativos();
                niveles.Eliminar(id);
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