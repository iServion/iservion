module.exports = {
		 table : "znotification",
		 routeName : "znotification",
		 title : "Notification",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "description",
			 "table",
			 "user_id",
			 "status",
			 "status_label",
			 "link",
			 "token",
			 "id_data"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "description",
			 "table",
			 "user_id",
			 "status",
			 "status_label",
			 "link",
			 "token",
			 "id_data"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 title : "Title",
			 description : "Description",
			 table : "Table",
			 user_id : "User",
			 status : "Status",
			 status_label : "Status Label",
			 link : "Link",
			 token : "Token",
			 id_data : "ID Data",
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
			 description : {
				 name : "description",
				 title : "Description",
				 placeholder : "Description",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 table : {
				 name : "table",
				 title : "Table",
				 placeholder : "Table",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 user_id : {
				 name : "user_id",
				 title : "User",
				 placeholder : "User",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 status : {
				 name : "status",
				 title : "Status",
				 placeholder : "Status",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 status_label : {
				 name : "status_label",
				 title : "Status Label",
				 placeholder : "Status Label",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 link : {
				 name : "link",
				 title : "Link",
				 placeholder : "Link",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
				 search : "ILIKE",
				 key : ""
			 }, 
			 id_data : {
				 name : "id_data",
				 title : "ID Data",
				 placeholder : "ID Data",
				 type : "bigint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
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
			 description : "ILIKE",
			 table : "ILIKE",
			 user_id : "=",
			 status : "=",
			 status_label : "ILIKE",
			 link : "ILIKE",
			 token : "ILIKE",
			 id_data : "=",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"title",
			 	"description",
			 	"status",
			 	"status_label",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"table",
			 	"user_id",
			 	"link",
			 	"token",
			 	"id_data"
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
			 description : "",
			 table : "",
			 user_id : "",
			 status : "",
			 status_label : "",
			 link : "",
			 token : "",
			 id_data : "",
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
			 description : {
				 name : "text",
				 hidden : false
			 }, 
			 table : {
				 name : "text",
				 hidden : false
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
			 status : {
				 name : "integer",
				 hidden : false
			 }, 
			 status_label : {
				 name : "text",
				 hidden : false
			 }, 
			 link : {
				 name : "text",
				 hidden : false
			 }, 
			 token : {
				 name : "text",
				 hidden : false
			 }, 
			 id_data : {
				 name : "integer",
				 hidden : false
			 },
		 }, 
}