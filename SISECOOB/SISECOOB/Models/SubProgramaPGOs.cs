using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace SISECOOB.Models
{
    [MetadataType(typeof(mSubProgramasEdu))]
    public partial class SubProgramasPGOs
    {
        public class mSubProgramasEdu
        {
            [Display(Name = "Identificador")]
            public int? SubprogramaPGOID { get; set; }


            [Display(Name = "SubPrograma")]
            public string SubprogramaPGO { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.SubProgramasPGOs.AddObject(this);
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
                SubProgramasPGOs pro = db.SubProgramasPGOs.FirstOrDefault(i => i.SubprogramaPGOID == this.SubprogramaPGOID);
                pro.SubprogramaPGO = SubprogramaPGO;

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
                SubProgramasPGOs pro = db.SubProgramasPGOs.FirstOrDefault(i => i.SubprogramaPGOID == id);
                db.SubProgramasPGOs.DeleteObject(pro);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}