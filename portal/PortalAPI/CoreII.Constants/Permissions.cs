// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
using System;
using System.Collections.Generic;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CoreII.Constants
{
    public class Permissions
    {
        //TODO probably need to find a better way to store these
        // went with this route to prevent a databse call everytime a
        // route needs to be checked
        //will require a new object to be made each time instead which
        //is better but not ideal

        private class permissionConst
        {
            public int id { get; set; }
            public string name { get; set; }
        }
        private List<permissionConst> perms;

        public Permissions()
        {
            perms.Add(new permissionConst() { name = "sa", id = 1 });
            perms.Add(new permissionConst() { name = "userView", id = 2 });
            perms.Add(new permissionConst() { name = "userEdit", id = 3 });
            perms.Add(new permissionConst() { name = "userDelete", id = 4 });
            perms.Add(new permissionConst() { name = "roleView", id = 5 });
            perms.Add(new permissionConst() { name = "roleEdit", id = 6 });
            perms.Add(new permissionConst() { name = "roleDelete", id = 7 });
            perms.Add(new permissionConst() { name = "reportView", id = 8 });
            perms.Add(new permissionConst() { name = "reportEdit", id = 9 });
            perms.Add(new permissionConst() { name = "reportDelete", id = 10 });
            perms.Add(new permissionConst() { name = "dataView", id = 11 });
            perms.Add(new permissionConst() { name = "dateEdit", id = 12 });
            perms.Add(new permissionConst() { name = "dataDelete", id = 13 });
        }

        public int nameToInt(string val)
        {
            return perms.Where(a => a.name == val).First().id;
        }
        public string intToName(int val)
        {
            return perms.Where(a => a.id == val).First().name;
        }


    }
}




//public class test
//{

//    private class permissionConst
//    {
//        public int id { get; set; }
//        public string name { get; set; }
//    }
//    private test(string value) { Value = value; }

//    private static IReadOnlyList<permissionConst> perms = new List<permissionConst>

//    public string Value { get; private set; }

//    public static test APIURL { get { return new test("APIURL"); } }
//    public static test EXAMPLE { get { return new test("Example"); } }

//    public override string ToString()
//    {
//        return Value;
//    }
//}