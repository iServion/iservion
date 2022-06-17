module.exports = {
		 table : "server",
		 routeName : "server",
		 title : "Server",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "host",
			 "username",
			 "type_id",
			 "alert",
			 "services",
			 "file",
			 "status",
			 "description",
			 "password"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "host",
			 "username",
			 "type_id",
			 "alert",
			 "services",
			 "file",
			 "status",
			 "description",
			 "password"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 title : "Title",
			 host : "Host",
			 username : "Username",
			 type_id : "Type",
			 alert : "Alert",
			 services : "Services",
			 file : "Private Key File",
			 status : "Status",
			 description : "Description",
			 password : "Password",
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
				 search : "ILIKE",
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
				 search : "ILIKE",
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
			 title : {
				 name : "title",
				 title : "Title",
				 placeholder : "Title",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 host : {
				 name : "host",
				 title : "Host",
				 placeholder : "Host",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 username : {
				 name : "username",
				 title : "Username",
				 placeholder : "Username",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 type_id : {
				 name : "type_id",
				 title : "Type",
				 placeholder : "Type",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 alert : {
				 name : "alert",
				 title : "Alert",
				 placeholder : "Alert",
				 type : "smallint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 services : {
				 name : "services",
				 title : "Services",
				 placeholder : "Services",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 file : {
				 name : "file",
				 title : "Private Key File",
				 placeholder : "Private Key File",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 status : {
				 name : "status",
				 title : "Status",
				 placeholder : "Status",
				 type : "smallint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 description : {
				 name : "description",
				 title : "Description",
				 placeholder : "Description",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
				 search : "ILIKE",
				 key : ""
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
			 company_id : "=",
			 created_at : "ILIKE",
			 updated_at : "ILIKE",
			 created_by : "=",
			 updated_by : "=",
			 title : "ILIKE",
			 host : "ILIKE",
			 username : "ILIKE",
			 type_id : "=",
			 alert : "=",
			 services : "ILIKE",
			 file : "ILIKE",
			 status : "=",
			 description : "ILIKE",
			 password : "ILIKE",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"title",
			 	"type_id",
			 	"status",
			 	"alert",
			 	"services",
			 	"description",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"host",
			 	"username",
			 	"file",
			 	"password"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 created_at : "",
			 updated_at : "",
			 created_by : "",
			 updated_by : "",
			 title : "",
			 host : "",
			 username : "",
			 type_id : "",
			 alert : "",
			 services : "",
			 file : "",
			 status : "",
			 description : "",
			 password : "",
			 no : "",
			 actionColumn : ""
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
			 title : {
				 name : "text",
				 hidden : false
			 }, 
			 host : {
				 name : "text",
				 hidden : false
			 }, 
			 username : {
				 name : "text",
				 hidden : false
			 }, 
			 type_id : {
				 name : "relation",
				 hidden : false,
				 table : "server_type",
				 fields : [
			 		"id",
			 		"CONCAT(title, ' ', region)"
				 ], 
				 isChain : false,
				 chains : {

				 }, 
				 hasCompanyId : true
			 }, 
			 alert : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"No",
			 		"Yes"
				 ],
			 }, 
			 services : {
				 name : "textarea",
				 hidden : false
			 }, 
			 file : {
				 name : "file",
				 hidden : false
			 }, 
			 status : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"UnActive",
			 		"Active"
				 ],
			 }, 
			 description : {
				 name : "editor",
				 hidden : false
			 }, 
			 password : {
				 name : "password",
				 hidden : false
			 },
		 }, 
}