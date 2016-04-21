using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class ProgramasController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string programa, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Programas> query = db.Programas;

            if (!string.IsNullOrEmpty(programa))
                query = query.Where(i => (i.Programa).Contains(programa));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.Programa)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.ProgramaID,
                                 nombre = i.Programa,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            Programas pro = db.Programas.FirstOrDefault(i => i.ProgramaID == id);
            Programas p = new Programas();

            if (pro != null)
            {
                p.ProgramaID = pro.ProgramaID;
                p.Programa = pro.Programa;
            }

            return PartialView("_Formulario", p);
        }

        [HttpPost]
        public JsonResult Create(Programas pro)
        {
            try
            {
                pro.Crear();
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
        public JsonResult Edicion(Programas pro)
        {
            try
            {
                pro.Editar();
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
                Programas pro = new Programas();
                pro.Eliminar(id);
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