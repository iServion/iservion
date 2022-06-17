module.exports = {
		 table : "zuser_company",
		 routeName : "zuser_company",
		 title : "Zuser Company",
		 keys : [
			 "id",
			 "role_id",
			 "user_id",
			 "company_id"
		 ], 
		 keysExcel : [
			 "id",
			 "role_id",
			 "user_id",
			 "company_id"
		 ], 
		 labels : {
			 id : "Id",
			 role_id : "Role",
			 user_id : "User",
			 company_id : "Company",
			 no : "#",
			 actionColumn : "Action"
		 }, 
		 fields : {
			 id : {
				 name : "id",
				 title : "Id",
				 placeholder : "Id",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : "PRI"
			 }, 
			 role_id : {
				 name : "role_id",
				 title : "Role",
				 placeholder : "Role",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 user_id : {
				 name : "user_id",
				 title : "User",
				 placeholder : "User",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 company_id : {
				 name : "company_id",
				 title : "Company",
				 placeholder : "Company",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : "MUL"
			 }, 
			 no : {
				 name : "no",
				 title : "#",
				 placeholder : "#"
			 }, 
			 actionColumn : {
				 name : "actionColumn",
				 title : "Action",
				 placeholder : "Action"
			 },
		 }, 
		 options : {
			 id : "=",
			 role_id : "=",
			 user_id : "=",
			 company_id : "=",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"user_id",
			 	"role_id",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id"
			 ],
		 }, 
		 datas : {
			 id : "",
			 role_id : "",
			 user_id : "",
			 company_id : "",
			 no : "",
			 actionColumn : ""
		 }, 
		 widgets : {
			 id : {
				 name : "integer",
				 hidden : false
			 }, 
			 role_id : {
				 name : "relation",
				 hidden : false,
				 table : "zrole",
				 fields : [
			 		"id",
			 		"CONCAT(name)"
				 ], 
				 isChain : false,
				 chains : {

				 }, 
				 hasCompanyId : true
			 }, 
			 user_id : {
				 name : "relation",
				 hidden : false,
				 table : "zuser",
				 fields : [
			 		"id",
			 		"CONCAT(fullname)"
				 ], 
				 isChain : false,
				 chains : {

				 }, 
				 hasCompanyId : true
			 },
		 }, 
}