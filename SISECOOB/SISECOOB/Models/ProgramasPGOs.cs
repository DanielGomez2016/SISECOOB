using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace SISECOOB.Models
{
    [MetadataType(typeof(mProgramas))]
    public partial class ProgramasPGOs
    {
        public class mProgramas
        {
            [Display(Name = "Identificador")]
            public int? ProgramaPGOID { get; set; }


            [Display(Name = "Programa")]
            public string ProgramaPGO { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.ProgramasPGOs.AddObject(this);
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
                ProgramasPGOs pro = db.ProgramasPGOs.FirstOrDefault(i => i.ProgramaPGOID == this.ProgramaPGOID);
                pro.ProgramaPGO = ProgramaPGO;

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
                ProgramasPGOs pro = db.ProgramasPGOs.FirstOrDefault(i => i.ProgramaPGOID == id);
                db.ProgramasPGOs.DeleteObject(pro);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}