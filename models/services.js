module.exports = {
		 table : "services",
		 routeName : "services",
		 title : "Services",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "server_id",
			 "title",
			 "description",
			 "status",
			 "display",
			 "kept_alive"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "server_id",
			 "title",
			 "description",
			 "status",
			 "display",
			 "kept_alive"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 server_id : "Server",
			 title : "Name",
			 description : "Description",
			 status : "Status",
			 display : "Display",
			 kept_alive : "Kept Alive",
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
			 title : {
				 name : "title",
				 title : "Name",
				 placeholder : "Name",
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
			 display : {
				 name : "display",
				 title : "Display",
				 placeholder : "Display",
				 type : "smallint",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 kept_alive : {
				 name : "kept_alive",
				 title : "Kept Alive",
				 placeholder : "Kept Alive",
				 type : "smallint",
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
			 server_id : "=",
			 title : "ILIKE",
			 description : "ILIKE",
			 status : "=",
			 display : "=",
			 kept_alive : "=",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"server_id",
			 	"title",
			 	"description",
			 	"status",
			 	"display",
			 	"kept_alive",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by"
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
			 title : "",
			 description : "",
			 status : "",
			 display : "",
			 kept_alive : "",
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
				 isChain : false,
				 chains : {

				 }, 
				 hasCompanyId : true
			 }, 
			 title : {
				 name : "text",
				 hidden : false
			 }, 
			 description : {
				 name : "textarea",
				 hidden : false
			 }, 
			 status : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"Unactive",
			 		"Active"
				 ],
			 }, 
			 display : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"Off",
			 		"On"
				 ],
			 }, 
			 kept_alive : {
				 name : "switch",
				 hidden : false,
				 fields : [
			 		"No",
			 		"Yes"
				 ],
			 },
		 }, 
}