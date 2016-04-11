using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mLeyes))]
    public partial class Leyes
    {
        public class mLeyes
        {
            [Display(Name = "Identificador")]
            public int? LeyesID { get; set; }


            [Display(Name = "Nombre Ley")]
            public string Ley { get; set; }

            [Display(Name = "Descripcion")]
            public string Descripcion { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Leyes.AddObject(this);
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
                Leyes ley = db.Leyes.FirstOrDefault(i => i.LeyesID == LeyesID);
                ley.Ley = Ley;
                ley.Descripcion = Descripcion;

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
                Leyes ley = db.Leyes.FirstOrDefault(i => i.LeyesID == id);
                db.Leyes.DeleteObject(ley);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}