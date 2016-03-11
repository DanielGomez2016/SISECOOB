using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mLocalidad))]
    public partial class Localidades
    {
        public class mLocalidad
        {
            [Display(Name = "Identificador")]
            public int? LocalidadId { get; set; }


            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

            [Display(Name = "Municipio")]
            public int MunicipioId_FK { get; set; }

        }

        public void Crear() {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Localidades.AddObject(this);
                db.SaveChanges();

            }
            catch (Exception e)
            {
                throw e;
            }
}

        public void Editar() {
            try {
                SISECOOBEntities db = new SISECOOBEntities();
                Localidades localidad = db.Localidades.FirstOrDefault(i => i.LocalidadId == this.LocalidadId);
                localidad.Nombre = Nombre;
                localidad.MunicipioId_FK = MunicipioId_FK;

                db.SaveChanges();
            }
            catch (Exception e){
                throw e;
            }
        }

        public void Eliminar(int id) {
            try {
                SISECOOBEntities db = new SISECOOBEntities();
                Localidades loc = db.Localidades.FirstOrDefault(i=> i.LocalidadId==id);
                db.Localidades.DeleteObject(loc);

                db.SaveChanges();
            }
            catch(Exception e)
            {
                throw e;
            }
        }
    }
}