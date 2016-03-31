using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    
    public  class Modulos
    {
        
    }

    [MetadataType(typeof(mModulos))]
    public partial class Menu
    {
        public class mModulos
        {
            [Display(Name = "Identificador")]
            public int? MenuID { get; set; }


            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

            [Display(Name = "Padre")]
            public string Padre { get; set; }

            [Display(Name = "Nivel")]
            public string Nivel { get; set; }

            [Display(Name = "Direccion")]
            public string Direccion { get; set; }

            [Display(Name = "Controlador")]
            public string Controlador { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Menu.AddObject(this);
                db.SaveChanges();

            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Editar()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Menu menu = db.Menu.FirstOrDefault(i => i.MenuID == this.MenuID);
                menu.Nombre = Nombre;
                menu.Nivel = Nivel;
                menu.Controlador = Controlador;
                menu.Direccion = Direccion;
                menu.Padre = Padre;
 
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Eliminar(int id)
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Menu menu = db.Menu.FirstOrDefault(i => i.MenuID == id);

                if (menu.Nivel == 0)
                {
                    List<Menu> menus = db.Menu.Where(j => j.Padre == menu.MenuID).ToList();

                    foreach (var m in menus) {

                        List<Menu> menush = db.Menu.Where(j => j.Padre == m.MenuID).ToList();
                        foreach (var mh in menush)
                        {
                            db.Menu.DeleteObject(mh);
                            db.SaveChanges();
                        }

                        db.Menu.DeleteObject(m);
                        db.SaveChanges();
                    }
                }

                db.Menu.DeleteObject(menu);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }

    [MetadataType(typeof(mMenu_Uusuarios))]
    public partial class Menu_Usuarios
    {
        public class mMenu_Uusuarios
        {
            [Display(Name = "Identificador")]
            public int? ID { get; set; }


            [Display(Name = "Modulos")]
            public int MenuID_Fk { get; set; }

            [Display(Name = "Usuario")]
            public string Usuario_Id { get; set; }

            public int[] modulos { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Menu_Usuarios.AddObject(this);
                db.SaveChanges();

            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Editar()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Menu menu = db.Menu.FirstOrDefault(i => i.MenuID == this.MenuID_Fk);


                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Eliminar(int id)
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Menu menu = db.Menu.FirstOrDefault(i => i.MenuID == id);

                db.Menu.DeleteObject(menu);
                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

    }
}