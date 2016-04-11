using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mDepartamentos))]
    public partial class Departamentos
    {
        public class mDepartamentos
        {
            [Display(Name = "Identificador")]
            public int? DepartamentoID { get; set; }


            [Display(Name = "Departamento")]
            public string Departamento { get; set; }

            [Display(Name = "Departamento")]
            public string JefeDepto { get; set; }

        }

        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Departamentos.AddObject(this);
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
                Departamentos dep = db.Departamentos.FirstOrDefault(i => i.DepartamentoID == DepartamentoID);
                dep.Departamento = Departamento;
                dep.JefeDepto = JefeDepto;

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
                Departamentos dep = db.Departamentos.FirstOrDefault(i => i.DepartamentoID == id);
                db.Departamentos.DeleteObject(dep);

                db.SaveChanges();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
    }
}