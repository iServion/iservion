module.exports = {
		 table : "zcompany",
		 routeName : "zcompany",
		 title : "Zcompany",
		 keys : [
			 "id",
			 "updated_by",
			 "created_by",
			 "created_at",
			 "updated_at",
			 "address",
			 "director",
			 "note",
			 "code",
			 "name",
			 "phone",
			 "logo"
		 ], 
		 keysExcel : [
			 "id",
			 "updated_by",
			 "created_by",
			 "created_at",
			 "updated_at",
			 "address",
			 "director",
			 "note",
			 "code",
			 "name",
			 "phone",
			 "logo"
		 ], 
		 labels : {
			 id : "Id",
			 updated_by : "Updated By",
			 created_by : "Created By",
			 created_at : "Created At",
			 updated_at : "Updated At",
			 address : "Address",
			 director : "Director",
			 note : "Note",
			 code : "Code",
			 name : "Name",
			 phone : "Phone",
			 logo : "Logo",
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
			 address : {
				 name : "address",
				 title : "Address",
				 placeholder : "Address",
				 type : "text",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
				 key : ""
			 }, 
			 director : {
				 name : "director",
				 title : "Director",
				 placeholder : "Director",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : false,
				 search : "ILIKE",
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
			 code : {
				 name : "code",
				 title : "Code",
				 placeholder : "Code",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : true,
				 search : "ILIKE",
				 key : ""
			 }, 
			 name : {
				 name : "name",
				 title : "Name",
				 placeholder : "Name",
				 type : "varchar(255) ",
				 category : "text",
				 length : "",
				 required : true,
				 search : "ILIKE",
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
				 search : "ILIKE",
				 key : ""
			 }, 
			 logo : {
				 name : "logo",
				 title : "Logo",
				 placeholder : "Logo",
				 type : "varchar(255) ",
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
			 updated_by : "=",
			 created_by : "=",
			 created_at : "ILIKE",
			 updated_at : "ILIKE",
			 address : "ILIKE",
			 director : "ILIKE",
			 note : "ILIKE",
			 code : "ILIKE",
			 name : "ILIKE",
			 phone : "ILIKE",
			 logo : "ILIKE",
			 no : "", 
			 actionColumn : "",
		 }, 
		 grids : {
			 visibles : [
			 	"no",
			 	"code",
			 	"name",
			 	"address",
			 	"phone",
			 	"actionColumn"
			 ], 
			 invisibles : [
			 	"id",
			 	"updated_by",
			 	"created_by",
			 	"created_at",
			 	"updated_at",
			 	"director",
			 	"note",
			 	"logo"
			 ],
		 }, 
		 datas : {
			 id : "",
			 updated_by : "",
			 created_by : "",
			 created_at : "",
			 updated_at : "",
			 address : "",
			 director : "",
			 note : "",
			 code : "",
			 name : "",
			 phone : "",
			 logo : "",
			 no : "",
			 actionColumn : ""
		 }, 
		 widgets : {
			 id : {
				 name : "integer",
				 hidden : false
			 }, 
			 created_at : {
				 name : "textarea",
				 hidden : false
			 }, 
			 updated_at : {
				 name : "textarea",
				 hidden : false
			 }, 
			 created_by : {
				 name : "textarea",
				 hidden : false
			 }, 
			 updated_by : {
				 name : "textarea",
				 hidden : false
			 }, 
			 address : {
				 name : "textarea",
				 hidden : false
			 }, 
			 director : {
				 name : "text",
				 hidden : false
			 }, 
			 note : {
				 name : "textarea",
				 hidden : false
			 }, 
			 code : {
				 name : "text",
				 hidden : false
			 }, 
			 name : {
				 name : "text",
				 hidden : false,
				 information : "After save please logout and login again"
			 }, 
			 phone : {
				 name : "text",
				 hidden : false
			 }, 
			 logo : {
				 name : "image",
				 hidden : false
			 },
		 }, 
}