module.exports = {
		 table : "zreport_filter",
		 routeName : "zreport_filter",
		 title : "ZReport Filter",
		 keys : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "name",
			 "label",
			 "type",
			 "value"
		 ], 
		 keysExcel : [
			 "id",
			 "company_id",
			 "created_at",
			 "updated_at",
			 "created_by",
			 "updated_by",
			 "name",
			 "label",
			 "type",
			 "value"
		 ], 
		 labels : {
			 id : "Id",
			 company_id : "Company",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 created_by : "Created By",
			 updated_by : "Updated By",
			 name : "Name",
			 label : "Label",
			 type : "Type",
			 value : "Value",
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
			 name : {
				 name : "name",
				 title : "Name",
				 placeholder : "Name",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 label : {
				 name : "label",
				 title : "Label",
				 placeholder : "Label",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "LIKE",
				 key : ""
			 }, 
			 type : {
				 name : "type",
				 title : "Type",
				 placeholder : "Type",
				 type : "tinyint(2)",
				 category : "integer",
				 length : "",
				 required : false,
				 search : "=",
				 key : ""
			 }, 
			 value : {
				 name : "value",
				 title : "Value",
				 placeholder : "Value",
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
			 name : "LIKE",
			 label : "LIKE",
			 type : "=",
			 value : "LIKE"
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"name",
			 	"label",
			 	"type",
			 	"value",
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
			 name : "",
			 label : "",
			 type : "",
			 value : ""
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
			 name : {
				 name : "text",
				 hidden : false
			 }, 
			 label : {
				 name : "text",
				 hidden : false
			 }, 
			 type : {
				 name : "select",
				 hidden : false,
				 fields : {
					 1 : "date",
					 2 : "select",
					 3 : "select from table"
				 },
			 }, 
			 value : {
				 name : "text",
				 hidden : false
			 },
		 }, 
}