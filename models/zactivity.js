module.exports = {
		 table : "zactivity",
		 routeName : "zactivity",
		 title : "ZActivity",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "user_id",
			 "table",
			 "title",
			 "status",
			 "status_label",
			 "description",
			 "id_data",
			 "data"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "user_id",
			 "table",
			 "title",
			 "status",
			 "status_label",
			 "description",
			 "id_data",
			 "data"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 user_id : "User",
			 table : "Table",
			 title : "Title",
			 status : "Status",
			 status_label : "Status label",
			 description : "Description",
			 id_data : "ID Data",
			 data : "Data",
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
				 title : "Status label",
				 placeholder : "Status label",
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
			 data : {
				 name : "data",
				 title : "Data",
				 placeholder : "Data",
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
			 user_id : "=",
			 table : "ILIKE",
			 title : "ILIKE",
			 status : "=",
			 status_label : "ILIKE",
			 description : "ILIKE",
			 id_data : "=",
			 data : "ILIKE",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"user_id",
			 	"table",
			 	"title",
			 	"description",
			 	"data",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"status",
			 	"status_label",
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
			 user_id : "",
			 table : "",
			 title : "",
			 status : "",
			 status_label : "",
			 description : "",
			 id_data : "",
			 data : "",
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
			 table : {
				 name : "text",
				 hidden : false
			 }, 
			 title : {
				 name : "text",
				 hidden : false
			 }, 
			 status : {
				 name : "integer",
				 hidden : false
			 }, 
			 status_label : {
				 name : "text",
				 hidden : false
			 }, 
			 description : {
				 name : "textarea",
				 hidden : false
			 }, 
			 id_data : {
				 name : "integer",
				 hidden : false
			 }, 
			 data : {
				 name : "textarea",
				 hidden : false
			 },
		 }, 
}