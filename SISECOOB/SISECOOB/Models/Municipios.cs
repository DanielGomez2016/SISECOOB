using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    [MetadataType(typeof(mMunicipio))]
    public partial class Municipios
    {
        public class mMunicipio
        {
            [Display(Name = "Identificador")]
            public int? MunicipioId { get; set; }


            [Display(Name = "Nombre")]
            public string Nombre { get; set; }

        }
        public void Crear()
        {
            try
            {
                SISECOOBEntities db = new SISECOOBEntities();
                db.Municipios.AddObject(this);
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
                Municipios municipio = db.Municipios.FirstOrDefault(i => i.MunicipioId == this.MunicipioId);
                municipio.Nombre = Nombre;

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
                Municipios mun = db.Municipios.FirstOrDefault(i => i.MunicipioId == id);

                if (mun != null)
                {
                    Localidades[] locs = db.Localidades.Where(x => x.MunicipioId_FK == mun.MunicipioId).ToArray();

                    foreach (var item in locs) {
                        db.Localidades.DeleteObject(item);
                        db.SaveChanges();
                    }


                    db.Municipios.DeleteObject(mun);
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