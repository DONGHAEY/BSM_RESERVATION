<h1>BSM_RESERVATION</h1>
<h3>학교 내, 선생님과 학생간 전자 인증 시스템</h3>
<p>베르실 사용, 이석증등을 디지털로 간편하게<p>
<p>를 개발할것이다..</p>

<h2>Functions - BssmReservation</h2>

Essential Functions

Func 1.
Add Room Method - ADMIN <= USER LEVEL
Required Param : roomCode, roomName, roomManagerUserCode, RoomType

roomCode is required to be same with school Entry DB Room Code
Because Later, Our server will control school Entry DB to help students to entry room with their student card.

Func2.
Add Room Entry Available Info - MANAGER <= USER LEVEL
Required Param : roomCode, day(1:Mon ~ 5:Fri), startTime(1330 == 13:30), endTime, requestType(Each HomeRoomTeacher, selfStudyTimeTeacher, dormitoryTeacher)

- Primary key : (roomCode, day, startTime)

Func 3.
Request Entering Room - GENERAL <= USER LEVEL & ROLETYPE == STUDENT
Required Param : Func2 Primary key, requested Teacher’s User Code, requesting Students` User Code List

- if Student doesn’t enter after Approval in 10 minutes,
  The Approval will be canceled.
- Teacher can deny their request with teacher’s reasons.

Func 4.
Approve Request, Deny Request.
