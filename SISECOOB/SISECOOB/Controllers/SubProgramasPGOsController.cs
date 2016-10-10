using SISECOOB.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace SISECOOB.Controllers
{
    public class SubProgramasPGOsController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Buscar(string subprograma, int page = 1, int pageSize = 15)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<SubProgramasPGOs> query = db.SubProgramasPGOs;

            if (!string.IsNullOrEmpty(subprograma))
                query = query.Where(i => (i.SubprogramaPGO).Contains(subprograma));

            return Json(new
            {
                total = query.Count(),
                datos = query.OrderBy(i => i.SubprogramaPGO)
                             .Skip((page - 1) * pageSize)
                             .Take(pageSize)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.SubprogramaPGOID,
                                 nombre = i.SubprogramaPGO,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Formulario(int id)
        {

            SISECOOBEntities db = new SISECOOBEntities();
            SubProgramasPGOs subpro = db.SubProgramasPGOs.FirstOrDefault(i => i.SubprogramaPGOID == id);
            SubProgramasPGOs sp = new SubProgramasPGOs();

            if (subpro != null)
            {
                sp.SubprogramaPGO = subpro.SubprogramaPGO;
                sp.SubprogramaPGOID = subpro.SubprogramaPGOID;
            }

            return PartialView("_Formulario", sp);
        }

        [HttpPost]
        public JsonResult Create(SubProgramasPGOs sub)
        {
            try
            {
                sub.Crear();
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
        public JsonResult Edicion(SubProgramasPGOs sub)
        {
            try
            {
                sub.Editar();
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
                SubProgramasPGOs subpro = new SubProgramasPGOs();
                subpro.Eliminar(id);
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