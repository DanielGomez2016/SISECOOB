using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SISECOOB.Controllers
{
    public class DepartamentosController : Controller
    {
        // GET: Departamentos
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string nombre, string jefe, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Departamentos> query = db.Departamentos;

            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(i => (i.Departamento).Contains(nombre));
            if (!string.IsNullOrEmpty(nombre))
                query = query.Where(i => (i.JefeDepto).Contains(jefe));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Departamento)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.DepartamentoID,
                                 nombre = i.Departamento,
                                 jefe = i.JefeDepto,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Departamentos dep = db.Departamentos.FirstOrDefault(i => i.DepartamentoID == id);
            Departamentos d = new Departamentos();

            if (dep != null)
            {
                d.DepartamentoID = dep.DepartamentoID;
                d.Departamento = dep.Departamento;
                d.JefeDepto = dep.JefeDepto;
            }

            return PartialView("_Formulario", d);
        }

        [HttpPost]
        public JsonResult Create(Departamentos depto)
        {
            try
            {
                depto.Crear();
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
        public JsonResult Edicion(Departamentos depto)
        {
            try
            {
                depto.Editar();
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
                Departamentos dep = new Departamentos();
                dep.Eliminar(id);
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