using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SISECOOB.Models
{
    public class ItemZona
    {
        public int itemID { get; set; }
        public string nombre { get; set; }
        public ItemZona(int itemID, string nombre)
        {
            this.itemID = itemID;
            this.nombre = nombre;
        }
    }

}