using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace foxhole
{
    public class Account
    {
        // just a container for info related to account
        public int eID;
        public bool loggedIn = false;
        public string userName;
        public string password;
        public string firstName;
        public string lastName;
        public int admin = 0;
        public string email;
        public string position;
    }
}