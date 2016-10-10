using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class ProgramasPGOsController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string programa, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<ProgramasPGOs> query = db.ProgramasPGOs;

            if (!string.IsNullOrEmpty(programa))
                query = query.Where(i => (i.ProgramaPGO).Contains(programa));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.ProgramaPGO)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.ProgramaPGOID,
                                 nombre = i.ProgramaPGO,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            ProgramasPGOs pro = db.ProgramasPGOs.FirstOrDefault(i => i.ProgramaPGOID == id);
            ProgramasPGOs p = new ProgramasPGOs();

            if (pro != null)
            {
                p.ProgramaPGOID = pro.ProgramaPGOID;
                p.ProgramaPGO = pro.ProgramaPGO;
            }

            return PartialView("_Formulario", p);
        }

        [HttpPost]
        public JsonResult Create(ProgramasPGOs pro)
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
        public JsonResult Edicion(ProgramasPGOs pro)
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
                ProgramasPGOs pro = new ProgramasPGOs();
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