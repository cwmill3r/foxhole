using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Script.Serialization;

//we need these to talk to mysql
using MySql.Data;
using MySql.Data.MySqlClient;
//and we need this to manipulate data from a db
using System.Data;

namespace foxhole
{
    /// <summary>
    /// Summary description for AccountServices
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)] 
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
    [System.Web.Script.Services.ScriptService]
    public class AccountServices : System.Web.Services.WebService
    {

        //EXAMPLE OF A SIMPLE SELECT QUERY (PARAMETERS PASSED IN FROM CLIENT)
        [WebMethod(EnableSession = true)] //NOTICE: gotta enable session on each individual method
        public Account LogOn(string userName, string password)
        {
            // we want to return some account info if they can login
            Account loginInfo = new Account();
            //our connection string comes from our web.config file like we talked about earlier
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //here's our query.  A basic select with nothing fancy.  Note the parameters that begin with @
            //NOTICE: we added admin to what we pull, so that we can store it along with the id in the session
            string sqlSelect = "SELECT * FROM employee WHERE userName=@userName and password=@password";

            //set up our connection object to be ready to use our connection string
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            //set up our command object to use our connection, and our query
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //tell our command to replace the @parameters with real values
            //we decode them because they came to us via the web so they were encoded
            //for transmission (funky characters escaped, mostly)
            sqlCommand.Parameters.AddWithValue("@userName", HttpUtility.UrlDecode(userName));
            sqlCommand.Parameters.AddWithValue("@password", HttpUtility.UrlDecode(password));

            //a data adapter acts like a bridge between our command object and 
            //the data we are trying to get back and put in a table object
            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            //here's the table we want to fill with the results from our query
            DataTable sqlDt = new DataTable();
            //here we go filling it!
            sqlDa.Fill(sqlDt);
            //check to see if any rows were returned.  If they were, it means it's 
            //a legit account
            if (sqlDt.Rows.Count > 0)
            {
                //if we found an account, store the id and admin status in the session
                //so we can check those values later on other method calls to see if they 
                //are 1) logged in at all, and 2) and admin or not
                Session["eID"] = sqlDt.Rows[0]["eID"];
                Session["admin"] = sqlDt.Rows[0]["admin"];
                // make the object we want to return
                loginInfo.eID = Convert.ToInt32(sqlDt.Rows[0]["eID"]);
                loginInfo.admin = Convert.ToInt32(sqlDt.Rows[0]["admin"]); 
                loginInfo.loggedIn = true;
                loginInfo.userName = sqlDt.Rows[0]["userName"].ToString(); // aka username
                loginInfo.firstName = sqlDt.Rows[0]["firstname"].ToString();
                loginInfo.lastName = sqlDt.Rows[0]["lastname"].ToString();
                loginInfo.email = sqlDt.Rows[0]["email"].ToString();
                loginInfo.position = sqlDt.Rows[0]["position"].ToString();

            }
            return loginInfo;
            //return the result!
            //var serializer = new JavaScriptSerializer();
            //var serializedResult = serializer.Serialize(loginInfo);
            //return serializedResult;

        }

        [WebMethod(EnableSession = true)]
        public bool LogOff()
        {
            //if they log off, then we remove the session.  That way, if they access
            //again later they have to log back on in order for their ID to be back
            //in the session!
            Session.Abandon();
            return true;
        }

        [WebMethod(EnableSession = true)]
        public SurveyQuestion[] GetAllSurveyQuestions()
        {
            //LOGIC: get all questions without their answers first
            DataTable sqlDt = new DataTable("question");

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //select all the questions *this wont iclude wrong answers*
            string sqlSelect = "select * from question";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            sqlDa.Fill(sqlDt);

            List<SurveyQuestion> questions = new List<SurveyQuestion>();

            for(int i = 0; i < sqlDt.Rows.Count; i++)
            {
                questions.Add(new SurveyQuestion
                {
                    qID = Convert.ToInt32(sqlDt.Rows[i]["qID"]),
                    text = sqlDt.Rows[i]["text"].ToString(),
                });
            }

            return questions.ToArray();
        }

        [WebMethod(EnableSession = true)]
        public BarData[] GetBarData()
        {
            //LOGIC: get all questions without their answers first
            DataTable sqlDt = new DataTable("response");

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //select all the questions *this wont iclude wrong answers*
            string sqlSelect = "SELECT sID, AVG(answer), EXTRACT(MONTH FROM date)as surveyMonth, EXTRACT(YEAR FROM date) as surveyYear FROM response WHERE answer != 'null' GROUP BY EXTRACT(MONTH FROM date)";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            sqlDa.Fill(sqlDt);

            List<BarData> barData = new List<BarData>();

            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                barData.Add(new BarData
                {
                    sID = Convert.ToInt32(sqlDt.Rows[i]["sID"]),
                    averageAnswer = Convert.ToDecimal(sqlDt.Rows[i]["AVG(answer)"]),
                    surveyMonth = Convert.ToInt32(sqlDt.Rows[i]["surveyMonth"]),
                    surveyYear = Convert.ToInt32(sqlDt.Rows[i]["surveyYear"]),
                });
            }

            return barData.ToArray();
        }

        [WebMethod(EnableSession = true)]
        public PieData[] GetPieData()
        {
            //LOGIC: get all questions without their answers first
            DataTable sqlDt = new DataTable("response");

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //select all the questions *this wont iclude wrong answers*
            string sqlSelect = "SELECT question.text, survey.sID, survey.qID, answer FROM response, survey, question WHERE response.completed = 1 AND response.sID = survey.sID AND survey.qID = question.qID";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            sqlDa.Fill(sqlDt);

            List<PieData> pieData = new List<PieData>();

            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                pieData.Add(new PieData
                {
                    questionText = Convert.ToString(sqlDt.Rows[i]["text"]),
                    sID = Convert.ToInt32(sqlDt.Rows[i]["sID"]),
                    qID = Convert.ToInt32(sqlDt.Rows[i]["qID"]),
                    answer = Convert.ToInt32(sqlDt.Rows[i]["answer"]),
                });
            }

            return pieData.ToArray();
        }

        [WebMethod(EnableSession = true)]
        public LineData[] GetLineData()
        {
            //LOGIC: get all questions without their answers first
            DataTable sqlDt = new DataTable("response");

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //select all the questions *this wont iclude wrong answers*
            string sqlSelect = "SELECT survey.qID, survey.sID, survey.date, (SUM(completed)/COUNT(completed)) as ResponseRate FROM response, survey WHERE response.sID = survey.sID GROUP BY date";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
            sqlDa.Fill(sqlDt);

            List<LineData> lineData = new List<LineData>();

            for (int i = 0; i < sqlDt.Rows.Count; i++)
            {
                lineData.Add(new LineData
                {
                    qID = Convert.ToInt32(sqlDt.Rows[i]["qID"]),
                    sID = Convert.ToInt32(sqlDt.Rows[i]["sID"]),
                    date = Convert.ToDateTime(sqlDt.Rows[i]["date"]),
                    ResponseRate = Convert.ToDecimal(sqlDt.Rows[i]["ResponseRate"]),
                });
            }

            return lineData.ToArray();
        }

        [WebMethod(EnableSession = true)]
        public Account[] GetEmployees  ()
        {
            //WE ONLY SHARE ACCOUNTS WITH LOGGED IN USERS!
            if (Session["eID"] != null)
            {
                DataTable sqlDt = new DataTable("employees");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = "select * from employee order by lastName";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                List<Account> employees = new List<Account>();
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    //only share user id and pass info with admins!
                    if (Convert.ToInt32(Session["admin"]) == 1)
                    {
                        employees.Add(new Account
                        {
                            eID = Convert.ToInt32(sqlDt.Rows[i]["eID"]),
                            userName = sqlDt.Rows[i]["userName"].ToString(),
                            password = sqlDt.Rows[i]["password"].ToString(),
                            firstName = sqlDt.Rows[i]["firstName"].ToString(),
                            lastName = sqlDt.Rows[i]["lastName"].ToString(),
                            admin = Convert.ToInt32(sqlDt.Rows[i]["admin"]),
                            email = sqlDt.Rows[i]["email"].ToString(),
                            position = sqlDt.Rows[i]["position"].ToString()
                        });
                    }
                    else
                    {
                        employees.Add(new Account
                        {
                            eID = Convert.ToInt32(sqlDt.Rows[i]["eID"]),
                            firstName = sqlDt.Rows[i]["firstName"].ToString(),
                            lastName = sqlDt.Rows[i]["lastName"].ToString(),
                            admin = Convert.ToInt32(sqlDt.Rows[i]["admin"]),
                            email = sqlDt.Rows[i]["email"].ToString(),
                            position = sqlDt.Rows[i]["position"].ToString()
                        });
                    }
                }
                //convert the list of accounts to an array and return!
                return employees.ToArray();
            }
            else
            {
                //if they're not logged in, return an empty array
                return new Account[0];
            }
        }


        // At first we are going to pass a single recipient and then later an array of recipients
        [WebMethod(EnableSession = true)]
        public int CreateSurvey(int qID, int privacy, int asking_eID, string date) // left recipient_eID out for testing
        {
            int surveyID = -1; // This is the id of the survey we will return

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row.
            string sqlSelect = "insert into survey (qID, privacy, asking_eID, date) " +
                "values(@qID, @privacy, @asking_eID, @date); SELECT LAST_INSERT_ID();";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@qID", qID);
            sqlCommand.Parameters.AddWithValue("@privacy", privacy);
            sqlCommand.Parameters.AddWithValue("@asking_eID", asking_eID);
            sqlCommand.Parameters.AddWithValue("@date", HttpUtility.UrlDecode(date));

            //this time, we're not using a data adapter to fill a data table.  We're just
            //opening the connection, telling our command to "executescalar" which says basically
            //execute the query and just hand me back the number the query returns (the ID, remember?).
            //don't forget to close the connection!
            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                surveyID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
            }
            catch (Exception e)
            {
            }

            sqlConnection.Close(); // I am just closing and opening again for simplicity - optimize later

            //for (int i = 0; i < recipients.Length; i++)
            //{
            //    string tempRecipient = recipients[i];
            //    int tempRecipientNum = Convert.ToInt32(tempRecipient);
            //    // Now we have to fill in the response table for the recipients
            //    string sqlSelectResponse = $"insert into response (answer, date, eID, sID, completed) " +
            //        $"values(null, null, {tempRecipientNum}, {surveyID}, 0); SELECT LAST_INSERT_ID();";

            //    MySqlCommand sqlCommandResponse = new MySqlCommand(sqlSelectResponse, sqlConnection);

            //    //sqlCommand.Parameters.AddWithValue("@qID", qID);

            //    //this time, we're not using a data adapter to fill a data table.  We're just
            //    //opening the connection, telling our command to "executescalar" which says basically
            //    //execute the query and just hand me back the number the query returns (the ID, remember?).
            //    //don't forget to close the connection!
            //    sqlConnection.Open();
            //    //we're using a try/catch so that if the query errors out we can handle it gracefully
            //    //by closing the connection and moving on
            //    try
            //    {
            //        Convert.ToInt32(sqlCommandResponse.ExecuteScalar());
            //        // we currently dont do anything with this but we could return it
            //        recipientSuccess = true;
            //    }
            //    catch (Exception e)
            //    {
            //    }
            //    sqlConnection.Close();
            //}

            if (surveyID != -1)
            {
                return surveyID;
            }
            sqlConnection.Close();
            return -1;
        }

        // This is a service we can use in a loop on the JavaScript side to fill in the recipients
        // when we create a survey. When finished we will take the functionality out of the above method
        // and use these two together... altogether avoiding passing an array to any services making testing easier
        // The only thing that could screw this up is if the loop is too fast to actually run the service... :/
        [WebMethod(EnableSession = true)]
        public bool FillRecipientsTable(int recipient_eID, int surveyID) // we get surveyID back from the above method
        {
            bool success = false;
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row.
            string sqlSelect = $"insert into response (answer, date, eID, sID, completed) " +
                $"values(null, null, {recipient_eID}, {surveyID}, 0); SELECT LAST_INSERT_ID();";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //this time, we're not using a data adapter to fill a data table.  We're just
            //opening the connection, telling our command to "executescalar" which says basically
            //execute the query and just hand me back the number the query returns (the ID, remember?).
            //don't forget to close the connection!
            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                surveyID = Convert.ToInt32(sqlCommand.ExecuteScalar());
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
                return success = true;
            }
            catch (Exception e)
            {
            }

            sqlConnection.Close(); // I am just closing and opening again for simplicity - optimize later
            return success;
        }

        // Service to get all surveys that a person has been sent but hasnt responded to
        [WebMethod(EnableSession = true)]
        public List<Survey> GetUnrespondedSurveys(int eID) // we get surveyID aka eID back from the above method
        {
            List<Survey> tmpSurveys = new List<Survey>(); // kind of a temporary list (we return this)
            
            //WE ONLY LET LOGGED IN USERS SEE THEIR SURVEYS!
            if (Session["eID"] != null)
            {
                DataTable sqlDt = new DataTable("surveys");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = $"select * from survey, response where survey.sID = response.sID and response.eID = {eID} and response.completed = 0";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                //loop through each row in the dataset, creating instances
                //of our container class Account.  Fill each acciount with
                //data from the rows, then dump them in a list.
                
                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    tmpSurveys.Add(new Survey
                    {
                        sID = Convert.ToInt32(sqlDt.Rows[i]["sID"]),
                        qID = Convert.ToInt32(sqlDt.Rows[i]["qID"]),
                        privacy = Convert.ToInt32(sqlDt.Rows[i]["privacy"]),
                        asking_eID = Convert.ToInt32(sqlDt.Rows[i]["asking_eID"]),
                        date = sqlDt.Rows[i]["date"].ToString(),
                    });
                    string questionText = GetQuestionText(tmpSurveys[i].qID);
                    tmpSurveys[i].questionText = questionText;
                    
                }
                //convert the list of accounts to an array and return!
                return tmpSurveys;
            }
            else
            {
                //if they're not logged in, return an empty array
                return tmpSurveys;
            }
        }

        [WebMethod(EnableSession = true)]
        public List<Survey> GetSurvey(int sID)
        {
            List<Survey> tmpSurvey = new List<Survey>(); // kind of a temporary list (we return this)

            //WE ONLY LET LOGGED IN USERS SEE THEIR SURVEY!
            if (Session["eID"] != null)
            {
                DataTable sqlDt = new DataTable("surveys");

                string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
                string sqlSelect = $"select * from survey where survey.sID = {sID}";

                MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
                MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

                //gonna use this to fill a data table
                MySqlDataAdapter sqlDa = new MySqlDataAdapter(sqlCommand);
                //filling the data table
                sqlDa.Fill(sqlDt);

                for (int i = 0; i < sqlDt.Rows.Count; i++)
                {
                    tmpSurvey.Add(new Survey
                    {
                        sID = Convert.ToInt32(sqlDt.Rows[i]["sID"]),
                        qID = Convert.ToInt32(sqlDt.Rows[i]["qID"]),
                        privacy = Convert.ToInt32(sqlDt.Rows[i]["privacy"]),
                        asking_eID = Convert.ToInt32(sqlDt.Rows[i]["asking_eID"]),
                        date = sqlDt.Rows[i]["date"].ToString(),
                    });
                    string questionText = GetQuestionText(tmpSurvey[i].qID);
                    tmpSurvey[i].questionText = questionText;

                }
                
                return tmpSurvey;
            }
            else
            {
                //if they're not logged in, return an empty array
                return tmpSurvey;
            }
        }

        [WebMethod(EnableSession = true)]
        public string GetQuestionText(int qID)
        {
            string questionText; // we'll return this

            DataTable sqlDt = new DataTable("question");

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            string sqlSelect = $"select text from question where question.qID = {qID}";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                questionText = sqlCommand.ExecuteScalar().ToString();
                //here, you could use this accountID for additional queries regarding
                //the requested account.  Really this is just an example to show you
                //a query where you get the primary key of the inserted row back from
                //the database!
                return questionText;
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
            return "failed";
        }
        [WebMethod(EnableSession = true)]
        public int CreateAccount(string userName, string password, string firstName, string lastName, string email, string position)
        {
          int eID = -1;
          string admin = "0";// defaults to non-admin user
          string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
          //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
          //does is tell mySql server to return the primary key of the last inserted row
          string sqlSelect = $"insert into employee (eID, userName, password, firstName, lastName, admin, email, position) values(@userName, @password, @firstName, @lastName, @admin, @email, @position); SELECT LAST_INSERT_ID();";
          Console.WriteLine(sqlSelect);
          // add creatorId
          MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
          MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

          //sqlCommand.Parameters.AddWithValue("@eId", eId);
          sqlCommand.Parameters.AddWithValue("@userName", HttpUtility.UrlDecode(userName));
          sqlCommand.Parameters.AddWithValue("@password", HttpUtility.UrlDecode(password));
          sqlCommand.Parameters.AddWithValue("@firstName", HttpUtility.UrlDecode(firstName));
          sqlCommand.Parameters.AddWithValue("@lastName", HttpUtility.UrlDecode(lastName));
          sqlCommand.Parameters.AddWithValue("@email", HttpUtility.UrlDecode(email));
          sqlCommand.Parameters.AddWithValue("@position", HttpUtility.UrlDecode(position));
          sqlCommand.Parameters.AddWithValue("@admin", HttpUtility.UrlDecode(admin));


          //this time, we're not using a data adapter to fill a data table.  We're just
          //opening the connection, telling our command to "executescalar" which says basically
          //execute the query and just hand me back the number the query returns (the ID, remember?).
          //don't forget to close the connection!
          sqlConnection.Open();
          //we're using a try/catch so that if the query errors out we can handle it gracefully
          //by closing the connection and moving on
          try
          {
            eID = Convert.ToInt32(sqlCommand.ExecuteScalar());
            //here, you could use this accountID for additional queries regarding
            //the requested account.  Really this is just an example to show you
            //a query where you get the primary key of the inserted row back from
            //the database!

          }
          catch (Exception e)
          {
            return eID;
          }
          sqlConnection.Close();
          return eID;
        }

        [WebMethod(EnableSession = true)]
        public void UpdateAccount(string eID, string userName, string password, string firstName, string lastName, string email, string position)
        {
          //WRAPPING THE WHOLE THING IN AN IF STATEMENT TO CHECK IF THEY ARE AN ADMIN!
          if (Convert.ToInt32(Session["admin"]) == 1)
          {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //this is a simple update, with parameters to pass in values
            string sqlSelect = "update employee set userName=@userNameValue, password=@passwordValue, firstName=@firstNameValue, lastName=@lastNameValue, " +
            "email=@emailValue where eID=@eIDValue";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@userNameValue", HttpUtility.UrlDecode(userName));
            sqlCommand.Parameters.AddWithValue("@passwordValue", HttpUtility.UrlDecode(password));
            sqlCommand.Parameters.AddWithValue("@firstNameValue", HttpUtility.UrlDecode(firstName));
            sqlCommand.Parameters.AddWithValue("@lastNameValue", HttpUtility.UrlDecode(lastName));
            sqlCommand.Parameters.AddWithValue("@emailValue", HttpUtility.UrlDecode(email));
            sqlCommand.Parameters.AddWithValue("@positionValue", HttpUtility.UrlDecode(position));
            sqlCommand.Parameters.AddWithValue("@eIDValue", HttpUtility.UrlDecode(eID));

            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
              sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {
            }
            sqlConnection.Close();
          }
        }

        [WebMethod(EnableSession = true)]
        public void DeleteAccount(int eID)
        {
          if (Convert.ToInt32(Session["admin"]) == 1)
          {
            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //this is a simple update, with parameters to pass in values
            string sqlSelect = "delete from employee where eID = @eIDValue;";

            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            sqlCommand.Parameters.AddWithValue("@eIDValue", HttpUtility.UrlDecode(Convert.ToString(eID)));

            sqlConnection.Open();
            try
            {
              sqlCommand.ExecuteNonQuery();
            }
            catch (Exception e)
            {

            }
            sqlConnection.Close();
          }
        }

        [WebMethod(EnableSession = true)]
        public int SubmitSurveyResponse(int eID, int sID, int answer, string date)
        {
            int success = -1; // the response ID we will return at the end

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row
            string sqlSelect = $"update response set answer=@answer, date=@date, completed=1 where eID=@eID and sID=@sID and completed=0";
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //sqlCommand.Parameters.AddWithValue("@eId", eId);
            sqlCommand.Parameters.AddWithValue("@eID", eID);
            sqlCommand.Parameters.AddWithValue("@sID", sID);
            sqlCommand.Parameters.AddWithValue("@answer", answer);
            sqlCommand.Parameters.AddWithValue("@date", HttpUtility.UrlDecode(date));

            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                Convert.ToInt32(sqlCommand.ExecuteScalar());
                return success = 1;
            }
            catch (Exception e)
            {
                return success;
            }
        }

        [WebMethod(EnableSession = true)]
        public int SubmitAnonSurveyResponse(int eID, int sID, int answer, string date)
        {
            int success = -1; // the response ID we will return at the end

            string sqlConnectString = System.Configuration.ConfigurationManager.ConnectionStrings["myDB"].ConnectionString;
            //the only thing fancy about this query is SELECT LAST_INSERT_ID() at the end.  All that
            //does is tell mySql server to return the primary key of the last inserted row
            string sqlSelect = $"update response set eID=-1, answer=@answer, date=@date, completed=1 where eID=@eID and sID=@sID and completed=0;";
            MySqlConnection sqlConnection = new MySqlConnection(sqlConnectString);
            MySqlCommand sqlCommand = new MySqlCommand(sqlSelect, sqlConnection);

            //sqlCommand.Parameters.AddWithValue("@eId", eId);
            sqlCommand.Parameters.AddWithValue("@eID", eID);
            sqlCommand.Parameters.AddWithValue("@sID", sID);
            sqlCommand.Parameters.AddWithValue("@answer", answer);
            sqlCommand.Parameters.AddWithValue("@date", HttpUtility.UrlDecode(date));

            sqlConnection.Open();
            //we're using a try/catch so that if the query errors out we can handle it gracefully
            //by closing the connection and moving on
            try
            {
                Convert.ToInt32(sqlCommand.ExecuteScalar());
                sqlConnection.Close();
                success = 1;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                sqlConnection.Close();
            }
            sqlConnection.Close();
            return success;
        }
    }
}

