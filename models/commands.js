module.exports = {
		 table : "commands",
		 routeName : "commands",
		 title : "Commands",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "server_id",
			 "service_id",
			 "command",
			 "description",
			 "response_format",
			 "title",
			 "path",
			 "long_command"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "server_id",
			 "service_id",
			 "command",
			 "description",
			 "response_format",
			 "title",
			 "path",
			 "long_command"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 server_id : "Server",
			 service_id : "Service",
			 command : "Command",
			 description : "Description",
			 response_format : "Response Format",
			 title : "Title",
			 path : "Path",
			 long_command : "Long Command",
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
			 server_id : {
				 name : "server_id",
				 title : "Server",
				 placeholder : "Server",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 service_id : {
				 name : "service_id",
				 title : "Service",
				 placeholder : "Service",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 command : {
				 name : "command",
				 title : "Command",
				 placeholder : "Command",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
			 response_format : {
				 name : "response_format",
				 title : "Response Format",
				 placeholder : "Response Format",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
			 path : {
				 name : "path",
				 title : "Path",
				 placeholder : "Path",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 long_command : {
				 name : "long_command",
				 title : "Long Command",
				 placeholder : "Long Command",
				 type : "text",
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
			 server_id : "=",
			 service_id : "=",
			 command : "ILIKE",
			 description : "ILIKE",
			 response_format : "ILIKE",
			 title : "ILIKE",
			 path : "ILIKE",
			 long_command : "ILIKE",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"server_id",
			 	"service_id",
			 	"title",
			 	"command",
			 	"long_command",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"description",
			 	"response_format",
			 	"path"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 created_at : "",
			 updated_at : "",
			 created_by : "",
			 updated_by : "",
			 server_id : "",
			 service_id : "",
			 command : "",
			 description : "",
			 response_format : "",
			 title : "",
			 path : "",
			 long_command : "",
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
			 server_id : {
				 name : "relation",
				 hidden : false,
				 table : "server",
				 fields : [
			 		"id",
			 		"CONCAT(title)"
				 ], 
				 isChain : true,
				 chains : {
					 service_id : {
						 column : "server_id",
						 table : "services"
					 },
				 }, 
				 hasCompanyId : true
			 }, 
			 service_id : {
				 name : "relation",
				 hidden : false,
				 table : "services",
				 fields : [
			 		"id",
			 		"CONCAT(title)"
				 ], 
				 isChain : true,
				 chains : {

				 }, 
				 hasCompanyId : true
			 }, 
			 command : {
				 name : "text",
				 hidden : false
			 }, 
			 description : {
				 name : "textarea",
				 hidden : false
			 }, 
			 response_format : {
				 name : "text",
				 hidden : true
			 }, 
			 title : {
				 name : "text",
				 hidden : false
			 }, 
			 path : {
				 name : "text",
				 hidden : true
			 }, 
			 long_command : {
				 name : "ide_editor",
				 hidden : false,
				 language : "javascript"
			 },
		 }, 
}