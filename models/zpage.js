module.exports = {
		 table : "zpage",
		 routeName : "zpage",
		 title : "ZPage",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "page",
			 "method",
			 "active",
			 "note",
			 "server_code",
			 "client_code"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "page",
			 "method",
			 "active",
			 "note",
			 "server_code",
			 "client_code"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 page : "Page",
			 method : "Method",
			 active : "Active",
			 note : "Note",
			 server_code : "Server Code",
			 client_code : "Client Code",
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
			 page : {
				 name : "page",
				 title : "Page",
				 placeholder : "Page",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : true,
				 search : "ILIKE",
				 key : ""
			 }, 
			 method : {
				 name : "method",
				 title : "Method",
				 placeholder : "Method",
				 type : "smallint",
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
				 type : "smallint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 note : {
				 name : "note",
				 title : "Note",
				 placeholder : "Note",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 server_code : {
				 name : "server_code",
				 title : "Server Code",
				 placeholder : "Server Code",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 client_code : {
				 name : "client_code",
				 title : "Client Code",
				 placeholder : "Client Code",
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
			 page : "ILIKE",
			 method : "=",
			 active : "=",
			 note : "ILIKE",
			 server_code : "ILIKE",
			 client_code : "ILIKE",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"page",
			 	"method",
			 	"active",
			 	"note",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"server_code",
			 	"client_code"
			 ],
		 }, 
		 datas : {
			 id : "",
			 company_id : "",
			 created_at : "",
			 updated_at : "",
			 created_by : "",
			 updated_by : "",
			 page : "",
			 method : "",
			 active : "",
			 note : "",
			 server_code : "",
			 client_code : "",
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
			 page : {
				 name : "text",
				 hidden : false
			 }, 
			 method : {
				 name : "select",
				 hidden : false,
				 fields : {
					 1 : "get",
					 2 : "post",
					 3 : "put",
					 4 : "delete"
				 },
			 }, 
			 active : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"No",
			 		"Yes"
				 ],
			 }, 
			 note : {
				 name : "textarea",
				 hidden : false
			 }, 
			 server_code : {
				 name : "ide_editor",
				 hidden : false,
				 language : "javascript"
			 }, 
			 client_code : {
				 name : "ide_editor",
				 hidden : false,
				 language : "ejs"
			 },
		 }, 
}