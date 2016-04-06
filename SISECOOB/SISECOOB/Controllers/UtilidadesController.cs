using IdentitySample.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using SISECOOB.Models;

namespace SISECOOB.Controllers
{
    public class UtilidadesController : Controller
    {
        // GET: Utilidades
       
        public JsonResult CargarMenu()
        {
            var userID = User.Identity.GetUserId();

            SISECOOBEntities db = new SISECOOBEntities();

            var menus = db.Menu_Usuarios
                     .Where(i => i.Usuario_Id == userID && i.Menu.Nivel == 0)
                     .OrderBy(i => new { i.Menu.Nombre })
                     .Select(i => new {
                         menuid = i.Menu.MenuID,
                         nombre = i.Menu.Nombre,
                         direccion = i.Menu.Direccion,
                         controlador = i.Menu.Controlador,
                         padre = i.Menu.Padre,
                         nivel = i.Menu.Nivel,
                         hijos = db.Menu.Where(e => e.Padre == i.MenuID_Fk).OrderBy(e => new { e.Nombre })
                         .Select(e => new {
                             menuid = e.MenuID,
                             nombre = e.Nombre,
                             direccion = e.Direccion,
                             controlador = e.Controlador,
                             padre = e.Padre,
                             nivel = e.Nivel,
                             hijos = db.Menu.Where(x => x.Padre == e.MenuID).OrderBy(x => new { x.Nombre })
                             .Select(x => new {
                                 menuid = x.MenuID,
                                 nombre = x.Nombre,
                                 direccion = x.Direccion,
                                 controlador = x.Controlador,
                                 padre = x.Padre,
                                 nivel = x.Nivel,
                         })
                         })
                     }).ToList();

            return Json(new
            {
                datos = menus,
                total = menus.Count(),
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CargarLocalidades(int municipio = 0)
        {
            SISECOOBEntities db = new SISECOOBEntities();

            IQueryable<Localidades> query = db.Localidades;

            if (municipio > 0)
                query = query.Where(i => i.Municipios.MunicipioId == municipio);

            return Json(new
            {
                datos = query.OrderBy(i => i.Nombre)
                             .ToList()
                             .Select(i => new
                             {
                                 id = i.LocalidadId,
                                 nombre = i.Nombre,
                             })
                             .ToList()
            }, JsonRequestBehavior.AllowGet);
        }
    }
}