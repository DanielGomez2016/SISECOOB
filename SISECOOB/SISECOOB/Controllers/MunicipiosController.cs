using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class MunicipiosController : Controller
    {
        // GET: Municipios
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string nombre, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Municipios> query = db.Municipios;

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
                                 ID = i.MunicipioId,
                                 NOMBRE = i.Nombre,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Municipios mun = db.Municipios.FirstOrDefault(i => i.MunicipioId == id);
            Municipios m = new Municipios();

            if (mun != null)
            {
                m.MunicipioId = mun.MunicipioId;
                m.Nombre = mun.Nombre;
            }

            return PartialView("_Formulario", m);
        }

        [HttpPost]
        public JsonResult Create(Municipios municipio)
        {
            try
            {
                municipio.Crear();
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
        public JsonResult Edicion(Municipios municipio)
        {
            try
            {
                municipio.Editar();
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
                Municipios municipio = new Municipios();
                municipio.Eliminar(id);
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