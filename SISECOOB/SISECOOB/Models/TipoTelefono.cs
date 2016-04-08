using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mTipoTelefono))]
    public partial class TipoTelefono
    {
        public class mTipoTelefono
        {
            [Display(Name = "Identificador")]
            public int? TelefonoID { get; set; }


            [Display(Name = "Nombre")]
            public string TipoTelefono1 { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.TipoTelefono.AddObject(this);
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
                TipoTelefono tip = db.TipoTelefono.FirstOrDefault(i => i.TelefonoID == TelefonoID);
                tip.TipoTelefono1 = TipoTelefono1;

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
                TipoTelefono tip = db.TipoTelefono.FirstOrDefault(i => i.TelefonoID == id);
                db.TipoTelefono.DeleteObject(tip);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}