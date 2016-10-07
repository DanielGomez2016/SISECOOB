using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class LocalidadesController : Controller
    {
        // GET: Localidades
        public ActionResult Index()
        {
            SISECOOBEntities db = new SISECOOBEntities();
            ViewBag.Municipios = db.Municipios.Select(i => new { id = i.MunicipioId, nombre = i.Nombre }).ToList();
            return View();
        }

        public JsonResult Buscar(string nombre, int municipio = 0, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Localidades> query = db.Localidades;

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(i => (i.Nombre).Contains(nombre));
            if (municipio > 0)
                query = query.Where(i => i.Municipios.MunicipioId == municipio);

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Municipios.Nombre)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.LocalidadId,
                                 nombre = i.Nombre,
                                 municipio = i.Municipios.Nombre
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Localidades loc = db.Localidades.FirstOrDefault(i => i.LocalidadId == id);

            ViewBag.Municipios = db.Municipios.Select(i => new { id = i.MunicipioId, nombre = i.Nombre }).ToList();

            Localidades l = new Localidades();

            if (loc != null)
            {
                l.LocalidadId = loc.LocalidadId;
                l.Nombre = loc.Nombre;
                l.MunicipioId_FK = loc.MunicipioId_FK;
            }

            return PartialView("_Formulario", l);
        }

        [HttpPost]
        public JsonResult Create(Localidades localidad)
        {
            try
            {
                localidad.Crear();
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
        public JsonResult Edicion(Localidades localidad)
        {
            try
            {
                localidad.Editar();
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
                Localidades localidad = new Localidades();
                localidad.Eliminar(id);
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