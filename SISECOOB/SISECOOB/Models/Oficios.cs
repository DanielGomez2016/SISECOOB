using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mOficios))]
    public partial class Oficios
    {
        public class mOficios
        {
            [Display(Name = "# Oficio")]
            public string OficioID { get; set; }

            [Display(Name = "Fecha")]
            public string FechaOficio { get; set; }

            [Display(Name = "Fecha llegada o Envio")]
            public string FechaRecibo { get; set; }

            [Display(Name = "Asunto")]
            public string Asunto { get; set; }

            [Display(Name = "Descripcion")]
            public string Descripcion { get; set; }

            [Display(Name = "Programa")]
            public string ProgramaID_Fk { get; set; }

            [Display(Name = "Tipo de Oficio")]
            public string TipoOficio_Fk { get; set; }

            public Boolean Recibido { get; set; }

        }

        public double[] montos { get; set; }

        public string[] cuentas { get; set; }

        public string[] tipocuenta { get; set; }

        public string Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();

                db.Oficios.AddObject(this);
                db.SaveChanges();

                return OficioID;

            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public string Editar()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Oficios ofic = db.Oficios.FirstOrDefault(i => i.OficioID == this.OficioID);

                ofic.FechaOficio = FechaOficio;
                ofic.FechaRecibo = FechaRecibo;
                ofic.Asunto = Asunto;
                ofic.Descripcion = Descripcion;
                ofic.ProgramaID_Fk = ProgramaID_Fk;
                ofic.TipoOficio_Fk = TipoOficio_Fk;
                ofic.Recibido = Recibido;

                db.SaveChanges();

                return OficioID;
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public void Eliminar(string id)
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Oficios ofi = db.Oficios.FirstOrDefault(i => i.OficioID == id);

                if (ofi != null)
                {

                    db.Oficios.DeleteObject(ofi);
                    db.SaveChanges();
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public Boolean Existe(string id)
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                Oficios ofi = db.Oficios.FirstOrDefault(i => i.OficioID == id);

                if (ofi != null)
                {
                    return false;
                }
                else {
                    return true;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}