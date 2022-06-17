module.exports = {
		 table : "zuser",
		 routeName : "zuser",
		 title : "User",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "username",
			 "password",
			 "token",
			 "fullname",
			 "address",
			 "phone",
			 "city",
			 "email",
			 "image",
			 "role_id",
			 "active",
			 "datas",
			 "last_login",
			 "forgot_password",
			 "language",
			 "jabatan",
			 "departement",
			 "verify_signed"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "username",
			 "password",
			 "token",
			 "fullname",
			 "address",
			 "phone",
			 "city",
			 "email",
			 "image",
			 "role_id",
			 "active",
			 "datas",
			 "last_login",
			 "forgot_password",
			 "language",
			 "jabatan",
			 "departement",
			 "verify_signed"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 username : "Username",
			 password : "Password",
			 token : "Token",
			 fullname : "Fullname",
			 address : "Address",
			 phone : "Phone",
			 city : "City",
			 email : "Email",
			 image : "Image",
			 role_id : "Role",
			 active : "Active",
			 datas : "Datas",
			 last_login : "Last Login",
			 forgot_password : "Forgot Password",
			 language : "Language",
			 jabatan : "Jabatan",
			 departement : "Departement",
			 verify_signed : "Verify Signed",
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
			 created_at : {
				 name : "created_at",
				 title : "Created At",
				 placeholder : "Created At",
				 type : "datetime",
				 category : "datetime",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 updated_at : {
				 name : "updated_at",
				 title : "Updated At",
				 placeholder : "Updated At",
				 type : "datetime",
				 category : "datetime",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 created_by : {
				 name : "created_by",
				 title : "Created By",
				 placeholder : "Created By",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 updated_by : {
				 name : "updated_by",
				 title : "Updated By",
				 placeholder : "Updated By",
				 type : "int",
				 category : "integer",
				 length : "", 
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 username : {
				 name : "username",
				 title : "Username",
				 placeholder : "Username",
				 type : "varchar(50)",
				 category : "text",
				 length : "",
				 required : true,
				 search : "LIKE",
				 key : ""
			 }, 
			 password : {
				 name : "password",
				 title : "Password",
				 placeholder : "Password",
				 type : "varchar(255)",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 token : {
				 name : "token",
				 title : "Token",
				 placeholder : "Token",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 fullname : {
				 name : "fullname",
				 title : "Fullname",
				 placeholder : "Fullname",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : true,
				 search : "LIKE",
				 key : ""
			 }, 
			 address : {
				 name : "address",
				 title : "Address",
				 placeholder : "Address",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 phone : {
				 name : "phone",
				 title : "Phone",
				 placeholder : "Phone",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 city : {
				 name : "city",
				 title : "City",
				 placeholder : "City",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 email : {
				 name : "email",
				 title : "Email",
				 placeholder : "Email",
				 type : "varchar(50)",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 image : {
				 name : "image",
				 title : "Image",
				 placeholder : "Image",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 role_id : {
				 name : "role_id",
				 title : "Role",
				 placeholder : "Role",
				 type : "int(11)",
				 category : "integer",
				 length : "",
				 required : true,
				 search : "=",
				 key : ""
			 }, 
			 active : {
				 name : "active",
				 title : "Active",
				 placeholder : "Active",
				 type : "tinyint(1)",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 datas : {
				 name : "datas",
				 title : "Datas",
				 placeholder : "Datas",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 last_login : {
				 name : "last_login",
				 title : "Last Login",
				 placeholder : "Last Login",
				 type : "datetime",
				 category : "datetime",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 forgot_password : {
				 name : "forgot_password",
				 title : "Forgot Password",
				 placeholder : "Forgot Password",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 language : {
				 name : "language",
				 title : "Language",
				 placeholder : "Language",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 jabatan : {
				 name : "jabatan",
				 title : "Jabatan",
				 placeholder : "Jabatan",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 departement : {
				 name : "departement",
				 title : "Departement",
				 placeholder : "Departement",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 verify_signed : {
				 name : "verify_signed",
				 title : "Verify Signed",
				 placeholder : "Verify Signed",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 },
		 }, 
		 options : {
			 id : "=",
			 company_id : "=",
			 created_at : "LIKE",
			 updated_at : "LIKE",
			 created_by : "=",
			 updated_by : "=",
			 username : "LIKE",
			 password : "LIKE",
			 token : "LIKE",
			 fullname : "LIKE",
			 address : "LIKE",
			 phone : "LIKE",
			 city : "LIKE",
			 email : "LIKE",
			 image : "LIKE",
			 role_id : "=",
			 active : "=",
			 datas : "LIKE",
			 last_login : "LIKE",
			 forgot_password : "LIKE",
			 language : "LIKE",
			 jabatan : "LIKE",
			 departement : "LIKE",
			 verify_signed : "LIKE"
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"username",
			 	"fullname",
				 "role_id",
				 "active",
				 "phone",
			 	"address",
			 	"city",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"token",
			 	"email",
			 	"image",
			 	"datas",
			 	"last_login",
			 	"forgot_password",
			 	"language",
			 	"verify_signed"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 created_at : "",
			 updated_at : "",
			 created_by : "",
			 updated_by : "",
			 username : "",
			 password : "",
			 token : "",
			 fullname : "",
			 address : "",
			 phone : "",
			 city : "",
			 email : "",
			 image : "",
			 role_id : "",
			 active : "",
			 datas : "",
			 last_login : "",
			 forgot_password : "",
			 language : "",
			 jabatan : "",
			 departement : "",
			 verify_signed : ""
		 }, 
		 widgets : {
			 id : {
				 name : "integer",
				 hidden : false
			 }, 
			 created_at : {
				 name : "datetime",
				 hidden : true
			 }, 
			 updated_at : {
				 name : "datetime",
				 hidden : true
			 }, 
			 created_by : {
				 name : "relation",
				 table : "zuser",
				 fields : [
			 		"id",
			 		"fullname"
				 ], 
				 hidden : true
			 }, 
			 updated_by : {
				 name : "relation",
				 table : "zuser",
				 fields : [
			 		"id",
			 		"fullname"
				 ], 
				 hidden : true
			 }, 
			 username : {
				 name : "email",
				 hidden : false
			 }, 
			 password : {
				 name : "password",
				 hidden : false
			 }, 
			 token : {
				 name : "text",
				 hidden : true
			 }, 
			 fullname : {
				 name : "text",
				 hidden : false
			 }, 
			 address : {
				 name : "text",
				 hidden : false
			 }, 
			 phone : {
				 name : "text",
				 hidden : false
			 }, 
			 city : {
				 name : "text",
				 hidden : false
			 }, 
			 email : {
				 name : "email",
				 hidden : true
			 }, 
			 image : {
				 name : "image",
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
				 hasCompanyId : true
			 }, 
			 active : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"No",
			 		"Yes"
				 ],
			 }, 
			 datas : {
				 name : "textarea",
				 hidden : true
			 }, 
			 last_login : {
				 name : "datetime",
				 hidden : true,
				 format : "YYYY-MM-DD HH:mm:ss"
			 }, 
			 forgot_password : {
				 name : "text",
				 hidden : true
			 }, 
			 language : {
				 name : "text",
				 hidden : false
			 }, 
			 jabatan : {
				 name : "text",
				 hidden : false
			 }, 
			 departement : {
				 name : "text",
				 hidden : false
			 }, 
			 verify_signed : {
				 name : "image",
				 hidden : false
			 },
		 }, 
}