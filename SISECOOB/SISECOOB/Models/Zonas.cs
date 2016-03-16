using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mZona))]
    public partial class Zonas
    {
        public class mZona
        {
            [Display(Name = "Identificador")]
            public int? ZonaID { get; set; }


            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

        }
        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Zonas.AddObject(this);
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
                Zonas zona = db.Zonas.FirstOrDefault(i => i.ZonaID == this.ZonaID);
                zona.Nombre = Nombre;

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
                Zonas to = db.Zonas.FirstOrDefault(i => i.ZonaID == id);

                if (to != null)
                {
                    db.Zonas.DeleteObject(to);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}