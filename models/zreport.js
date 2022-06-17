module.exports = {
		 table : "zreport",
		 routeName : "zreport",
		 title : "ZReport",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "title",
			 "description",
			 "json",
			 "excel",
			 "parent_id",
			 "filters"
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
			 "json",
			 "excel",
			 "parent_id",
			 "filters"
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
			 json : "JSON",
			 excel : "Excel",
			 parent_id : "Parent",
			 filters : "Filters",
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
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 json : {
				 name : "json",
				 title : "JSON",
				 placeholder : "JSON",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 excel : {
				 name : "excel",
				 title : "Excel",
				 placeholder : "Excel",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 parent_id : {
				 name : "parent_id",
				 title : "Parent",
				 placeholder : "Parent",
				 type : "int(11)",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 filters : {
				 name : "filters",
				 title : "Filters",
				 placeholder : "Filters",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
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
			 json : "ILIKE",
			 excel : "ILIKE",
			 parent_id : "=",
			 filters : "ILIKE"
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"title",
			 	"description",
			 	"excel",
			 	"parent_id",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"company_id",
			 	"created_at",
			 	"updated_at",
			 	"created_by",
			 	"updated_by",
			 	"json",
			 	"filters"
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
			 json : "",
			 excel : "",
			 parent_id : "",
			 filters : ""
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
				 name : "textarea",
				 hidden : false
			 }, 
			 json : {
				 name : "textarea",
				 hidden : true
			 }, 
			 excel : {
				 name : "file",
				 hidden : false
			 }, 
			 parent_id : {
				 name : "relation",
				 hidden : false,
				 table : "zreport",
				 fields : [
			 		"id",
			 		"CONCAT(title)"
				 ], 
				 hasCompanyId : true
			 }, 
			 filters : {
				 name : "table",
				 hidden : false,
				 table : "zreport_filter",
				 hasCompanyId : true
			 },
		 }, 
}