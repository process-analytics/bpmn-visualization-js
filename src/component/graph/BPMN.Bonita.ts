export const xmlContent = `
<?xml version="1.0" encoding="UTF-8"?>
<model:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bonitaConnector="http://www.bonitasoft.org/studio/connector/definition/6.0" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:di_1="http://www.omg.org/spec/DD/20100524/DI" xmlns:java="http://jcp.org/en/jsr/detail?id=270" xmlns:model="http://www.omg.org/spec/BPMN/20100524/MODEL" xsi:schemaLocation="schemaLocation http://www.omg.org/spec/BPMN/20100524/MODEL schemas/BPMN20.xsd" exporter="BonitaSoft" exporterVersion="7.9.4" expressionLanguage="http://groovy.apache.org/" targetNamespace="http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA">
  <model:import importType="http://www.w3.org/2001/XMLSchema" location="connectorDefs/scripting-groovy.defconnectors.xsd" namespace="http://www.bonitasoft.org/studio/connector/definition/6.0"/>
  <model:import importType="http://www.w3.org/2001/XMLSchema" location="connectorDefs/scripting-groovy-script.defconnectors.xsd" namespace="http://www.bonitasoft.org/studio/connector/definition/6.0"/>
  <model:collaboration id="_RLk98HH_Eei9Z4IY4QeFuA">
    <model:participant id="_WrR3gBszEeqkhYLXtt1BFw" name="RequestLoan" processRef="_RLk98XH_Eei9Z4IY4QeFuA"/>
    <model:participant id="_RLk_7nH_Eei9Z4IY4QeFuA" name="Employee actor">
      <model:documentation>This is an example of actor that is mapped to any ACME users</model:documentation>
    </model:participant>
    <model:participant id="_WsCsgBszEeqkhYLXtt1BFw" name="Notify Credit History Available" processRef="_RLlAI3H_Eei9Z4IY4QeFuA"/>
    <model:participant id="_RLlAQXH_Eei9Z4IY4QeFuA" name="Employee"/>
    <model:participant id="_WsDTkxszEeqkhYLXtt1BFw" name="LoanRequestBot" processRef="_RLlAYnH_Eei9Z4IY4QeFuA"/>
    <model:participant id="_RLllVnH_Eei9Z4IY4QeFuA" name="Employee"/>
    <model:participant id="_WuMooBszEeqkhYLXtt1BFw" name="deleteLoanRequest" processRef="_RLllnXH_Eei9Z4IY4QeFuA"/>
    <model:participant id="_RLll4nH_Eei9Z4IY4QeFuA" name="Employee"/>
    <model:participant id="_WuN2wRszEeqkhYLXtt1BFw" name="updateLoanCaseId" processRef="_RLlmBXH_Eei9Z4IY4QeFuA"/>
    <model:participant id="_RLlmR3H_Eei9Z4IY4QeFuA" name="Employee"/>
    <model:participant id="_WuPE4BszEeqkhYLXtt1BFw" name="generateLoanRequestsBot" processRef="_RLlmbHH_Eei9Z4IY4QeFuA"/>
    <model:participant id="_RLlmsHH_Eei9Z4IY4QeFuA" name="Employye"/>
    <model:messageFlow id="_hWPYMBa7EeqF6b6kCtCpmA" sourceRef="_zfYH0Ba7EeqF6b6kCtCpmA" targetRef="_RLk_hHH_Eei9Z4IY4QeFuA"/>
  </model:collaboration>
  <model:process id="_RLk98XH_Eei9Z4IY4QeFuA" name="RequestLoan">
    <model:ioSpecification id="_WrR3ghszEeqkhYLXtt1BFw">
      <model:dataInput id="_WrR3gxszEeqkhYLXtt1BFw" itemSubjectRef="_RLk_mHH_Eei9Z4IY4QeFuA"/>
      <model:dataInput id="_WrSekhszEeqkhYLXtt1BFw" itemSubjectRef="_P98VQHJDEei9Z4IY4QeFuA"/>
      <model:dataInput id="_WrSemBszEeqkhYLXtt1BFw" itemSubjectRef="_wl9KIHPAEeiw3J4-SJPrKA"/>
      <model:inputSet id="_WrR3hBszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WrR3gxszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WrSekxszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WrSekhszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WrSemRszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WrSemBszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:outputSet id="_WrSenRszEeqkhYLXtt1BFw"/>
    </model:ioSpecification>
    <model:laneSet id="RequestLoan_laneSet">
      <model:lane id="_RLk98nH_Eei9Z4IY4QeFuA" name="Customer">
        <model:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk9-HH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-IHH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-TXH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-UnH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-V3H_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-ZnH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-h3H_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-lnH_Eei9Z4IY4QeFuA</model:flowNodeRef>
      </model:lane>
      <model:lane id="_RLk-n3H_Eei9Z4IY4QeFuA" name="Customer Councellor">
        <model:flowNodeRef>_RLk-oHH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk-z3H_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_AXH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_BnH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_MXH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_O3H_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_QHH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_RXH_Eei9Z4IY4QeFuA</model:flowNodeRef>
      </model:lane>
      <model:lane id="_RLk_TnH_Eei9Z4IY4QeFuA" name="Validation Committee">
        <model:flowNodeRef>_RLk_T3H_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_dXH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_hHH_Eei9Z4IY4QeFuA</model:flowNodeRef>
        <model:flowNodeRef>_RLk_iXH_Eei9Z4IY4QeFuA</model:flowNodeRef>
      </model:lane>
    </model:laneSet>
    <model:dataObject id="DataObject_WrR3gRszEeqkhYLXtt1BFw_RLk_mHH_Eei9Z4IY4QeFuA" name="loanRequested" isCollection="false" itemSubjectRef="_RLk_mHH_Eei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WrSekRszEeqkhYLXtt1BFw_P98VQHJDEei9Z4IY4QeFuA" name="currentProcessVersion" isCollection="false" itemSubjectRef="_P98VQHJDEei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WrSelxszEeqkhYLXtt1BFw_wl9KIHPAEeiw3J4-SJPrKA" name="bankHistoryToReview" isCollection="false" itemSubjectRef="_wl9KIHPAEeiw3J4-SJPrKA"/>
    <model:startEvent id="_RLk983H_Eei9Z4IY4QeFuA" name="Request a Loan"/>
    <model:userTask id="_RLk9-HH_Eei9Z4IY4QeFuA" name="Complete Loan application"/>
    <model:userTask id="_RLk-IHH_Eei9Z4IY4QeFuA" name="Sign contract"/>
    <model:boundaryEvent id="_RLk-Q3H_Eei9Z4IY4QeFuA" name="Loan offer expiracy" attachedToRef="_RLk-IHH_Eei9Z4IY4QeFuA" cancelActivity="true">
      <model:timerEventDefinition id="eventdef-Loan offer expiracy">
        <model:timeCycle>2592000000L</model:timeCycle>
      </model:timerEventDefinition>
    </model:boundaryEvent>
    <model:exclusiveGateway id="_RLk-TXH_Eei9Z4IY4QeFuA" name="Scoring favorable" default="_RLk_uXH_Eei9Z4IY4QeFuA"/>
    <model:endEvent id="_RLk-UnH_Eei9Z4IY4QeFuA" name="KO - Request refused">
      <model:terminateEventDefinition id="_WrTFpBszEeqkhYLXtt1BFw"/>
    </model:endEvent>
    <model:serviceTask id="_RLk-V3H_Eei9Z4IY4QeFuA" name="Notify negative decision"/>
    <model:serviceTask id="_RLk-ZnH_Eei9Z4IY4QeFuA" name="Loan Scoring" implementation="BonitaConnector" operationRef="Execscripting-groovy">
      <model:ioSpecification id="_WrpD4BszEeqkhYLXtt1BFw">
        <model:dataInput id="_WrpD4RszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovyConnectorInput"/>
        <model:dataOutput id="_WrpD4xszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovyConnectorOutput"/>
        <model:inputSet id="_WrpD4hszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WrpD4RszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WrpD5BszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WrpD4xszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WrpD4RszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WrpD5RszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfo
import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfoSearchDescriptor
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder
import org.bonitasoft.engine.search.SearchResult

if(botActivated) {
\t
\t
\tdef searchBuilder = new SearchOptionsBuilder(0, 1);
\tsearchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.NAME, &quot;LoanRequestBot&quot;);
\tsearchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.ACTIVATION_STATE, &quot;ENABLED&quot;);
\tSearchResult searchResult = apiAccessor.getProcessAPI().searchProcessDeploymentInfos(searchBuilder.done());
\tdef processDefinitionId = searchResult.result.get(0).processId
\t
\tdef instantiationInputs = new HashMap();
\tinstantiationInputs.put(&quot;processInstanceIdInput&quot;, processInstanceId)
\tinstantiationInputs.put(&quot;amountInput&quot;, loanRequested.amount)
\t
\tapiAccessor.getProcessAPI().startProcessWithInputs(processDefinitionId, instantiationInputs)
}</model:from>
          <model:to id="_WrpD5hszEeqkhYLXtt1BFw">getDataInput('_WrpD4RszEeqkhYLXtt1BFw')/bonitaConnector:script</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:serviceTask id="_RLk-h3H_Eei9Z4IY4QeFuA" name="Notify offer expiracy"/>
    <model:endEvent id="_RLk-lnH_Eei9Z4IY4QeFuA" name="KO - Offer expired">
      <model:terminateEventDefinition id="_Wrpq8hszEeqkhYLXtt1BFw"/>
    </model:endEvent>
    <model:userTask id="_RLk-oHH_Eei9Z4IY4QeFuA" name="Validate Loan application"/>
    <model:userTask id="_RLk-z3H_Eei9Z4IY4QeFuA" name="Write loan contract with Duration and Loan Rate"/>
    <model:exclusiveGateway id="_RLk_AXH_Eei9Z4IY4QeFuA" name="accepted by councellor?" default="_RLk_wnH_Eei9Z4IY4QeFuA"/>
    <model:userTask id="_RLk_BnH_Eei9Z4IY4QeFuA" name="Validate Contract"/>
    <model:serviceTask id="_RLk_MXH_Eei9Z4IY4QeFuA" name="Credit funds"/>
    <model:endEvent id="_RLk_O3H_Eei9Z4IY4QeFuA" name="Success - Loan accepted">
      <model:terminateEventDefinition id="_WrqSBRszEeqkhYLXtt1BFw"/>
    </model:endEvent>
    <model:exclusiveGateway id="_RLk_QHH_Eei9Z4IY4QeFuA" name="requires validation from committee?" default="_RLk_33H_Eei9Z4IY4QeFuA"/>
    <model:exclusiveGateway id="_RLk_RXH_Eei9Z4IY4QeFuA" name="request validated"/>
    <model:userTask id="_RLk_T3H_Eei9Z4IY4QeFuA" name="Review Customer Credit History"/>
    <model:serviceTask id="_RLk_dXH_Eei9Z4IY4QeFuA" name="Request Credit History" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_WsAQQBszEeqkhYLXtt1BFw">
        <model:dataInput id="_WsAQQRszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_WsAQQxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_WsAQQhszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WsAQQRszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WsAQRBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WsAQQxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WsAQQRszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WsAQRRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">&quot;&quot;</model:from>
          <model:to id="_WsAQRhszEeqkhYLXtt1BFw">getDataInput('_WsAQQRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
      <model:dataOutputAssociation>
        <model:targetRef>_WsAQQxszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from id="_WsAQRxszEeqkhYLXtt1BFw">getDataOutput('_WsAQQRszEeqkhYLXtt1BFw')/bonitaConnector:result</model:from>
          <model:to xsi:type="model:tFormalExpression" id="_WsAQSBszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:com.company.model.Loan" language="http://www.w3.org/1999/XPath">getDataObject('_RLk_mHH_Eei9Z4IY4QeFuA')</model:to>
        </model:assignment>
      </model:dataOutputAssociation>
    </model:serviceTask>
    <model:intermediateCatchEvent id="_RLk_hHH_Eei9Z4IY4QeFuA" name="Credit History Received">
      <model:eventDefinitionRef>creditHistory</model:eventDefinitionRef>
    </model:intermediateCatchEvent>
    <model:exclusiveGateway id="_RLk_iXH_Eei9Z4IY4QeFuA" name="Credit History Cleared" default="_RLk_4nH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_pXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-oHH_Eei9Z4IY4QeFuA" targetRef="_RLk_AXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_qHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_AXH_Eei9Z4IY4QeFuA" targetRef="_RLk_RXH_Eei9Z4IY4QeFuA">
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_WsA3UxszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean">&quot;Accepted By Councellor&quot;.equals(loanRequested.status)</model:conditionExpression>
    </model:sequenceFlow>
    <model:sequenceFlow id="_RLk_rHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-z3H_Eei9Z4IY4QeFuA" targetRef="_RLk-IHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_r3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-ZnH_Eei9Z4IY4QeFuA" targetRef="_RLk-TXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_snH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk983H_Eei9Z4IY4QeFuA" targetRef="_RLk-ZnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_tXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-TXH_Eei9Z4IY4QeFuA" targetRef="_RLk9-HH_Eei9Z4IY4QeFuA">
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_WsBeYBszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean" language="http://www.w3.org/1999/XPath">isLoanScoringFavorable</model:conditionExpression>
    </model:sequenceFlow>
    <model:sequenceFlow id="_RLk_uXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-TXH_Eei9Z4IY4QeFuA" targetRef="_RLk-V3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_vHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-V3H_Eei9Z4IY4QeFuA" targetRef="_RLk-UnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_v3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk9-HH_Eei9Z4IY4QeFuA" targetRef="_RLk_QHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_wnH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_AXH_Eei9Z4IY4QeFuA" targetRef="_RLk-V3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_xXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-IHH_Eei9Z4IY4QeFuA" targetRef="_RLk_BnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_yHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-Q3H_Eei9Z4IY4QeFuA" targetRef="_RLk-h3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_y3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk-h3H_Eei9Z4IY4QeFuA" targetRef="_RLk-lnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_znH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_BnH_Eei9Z4IY4QeFuA" targetRef="_RLk_MXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_0XH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_MXH_Eei9Z4IY4QeFuA" targetRef="_RLk_O3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_1HH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_QHH_Eei9Z4IY4QeFuA" targetRef="_RLk_dXH_Eei9Z4IY4QeFuA">
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_WsCFcBszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean">loanRequested.amount >= 100000</model:conditionExpression>
    </model:sequenceFlow>
    <model:sequenceFlow id="_RLk_2HH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_dXH_Eei9Z4IY4QeFuA" targetRef="_RLk_hHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_23H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_iXH_Eei9Z4IY4QeFuA" targetRef="_RLk_RXH_Eei9Z4IY4QeFuA">
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_WsCFcRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean">&quot;Contract to be written&quot;.equals(loanRequested.status)</model:conditionExpression>
    </model:sequenceFlow>
    <model:sequenceFlow id="_RLk_33H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_QHH_Eei9Z4IY4QeFuA" targetRef="_RLk-oHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_4nH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_iXH_Eei9Z4IY4QeFuA" targetRef="_RLk-V3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_5XH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_T3H_Eei9Z4IY4QeFuA" targetRef="_RLk_iXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLk_63H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLk_RXH_Eei9Z4IY4QeFuA" targetRef="_RLk-z3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_iveJMHPFEeiw3J4-SJPrKA" name="" sourceRef="_RLk_hHH_Eei9Z4IY4QeFuA" targetRef="_RLk_T3H_Eei9Z4IY4QeFuA"/>
  </model:process>
  <model:itemDefinition id="_RLk_mHH_Eei9Z4IY4QeFuA" structureRef="java:com.company.model.Loan"/>
  <model:itemDefinition id="_P98VQHJDEei9Z4IY4QeFuA" structureRef="java:java.lang.String"/>
  <model:itemDefinition id="_wl9KIHPAEeiw3J4-SJPrKA" structureRef="java:com.company.model.BankHistory"/>
  <model:itemDefinition id="scripting-groovyConnectorInput" structureRef="bonitaConnector:scripting-groovyInputType"/>
  <model:message id="scripting-groovyConnectorMessageInput" itemRef="scripting-groovyConnectorInput"/>
  <model:itemDefinition id="scripting-groovyConnectorOutput" structureRef="bonitaConnector:scripting-groovyOutputType"/>
  <model:message id="scripting-groovyConnectorMessageOutput" itemRef="scripting-groovyConnectorOutput"/>
  <model:interface id="scripting-groovy_Bonita_Connector_Interface" name="scripting-groovy_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy" name="Execscripting-groovy">
      <model:inMessageRef>scripting-groovyConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovyConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:process id="_RLlAI3H_Eei9Z4IY4QeFuA" name="Notify Credit History Available">
    <model:ioSpecification id="_WsCsghszEeqkhYLXtt1BFw">
      <model:dataInput id="_WsCsgxszEeqkhYLXtt1BFw" itemSubjectRef="_ySuc8HMbEeiaCON5fHzqCA"/>
      <model:dataInput id="_WsCsiRszEeqkhYLXtt1BFw" itemSubjectRef="_OEhlIHO6Eeiw3J4-SJPrKA"/>
      <model:inputSet id="_WsCshBszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WsCsgxszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WsCsihszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WsCsiRszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:outputSet id="_WsCsjhszEeqkhYLXtt1BFw"/>
    </model:ioSpecification>
    <model:dataObject id="DataObject_WsCsgRszEeqkhYLXtt1BFw_ySuc8HMbEeiaCON5fHzqCA" name="requestID" isCollection="false" itemSubjectRef="_ySuc8HMbEeiaCON5fHzqCA"/>
    <model:dataObject id="DataObject_WsCsiBszEeqkhYLXtt1BFw_OEhlIHO6Eeiw3J4-SJPrKA" name="contractInfo" isCollection="false" itemSubjectRef="_OEhlIHO6Eeiw3J4-SJPrKA"/>
    <model:startEvent id="_RLlAJHH_Eei9Z4IY4QeFuA" name="Credit History Available"/>
    <model:endEvent id="_zfYH0Ba7EeqF6b6kCtCpmA" name="Send Credit History">
      <model:messageEventDefinition id="event-defcreditHistory"/>
    </model:endEvent>
    <model:sequenceFlow id="_RLlAPnH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAJHH_Eei9Z4IY4QeFuA" targetRef="_zfYH0Ba7EeqF6b6kCtCpmA"/>
  </model:process>
  <model:itemDefinition id="_ySuc8HMbEeiaCON5fHzqCA" structureRef="java:java.lang.String"/>
  <model:itemDefinition id="_OEhlIHO6Eeiw3J4-SJPrKA" structureRef="java:java.util.Map"/>
  <model:process id="_RLlAYnH_Eei9Z4IY4QeFuA" name="LoanRequestBot">
    <model:ioSpecification id="_WsD6oRszEeqkhYLXtt1BFw">
      <model:dataInput id="_WsD6ohszEeqkhYLXtt1BFw" itemSubjectRef="_RLllDHH_Eei9Z4IY4QeFuA"/>
      <model:dataInput id="_WsD6qBszEeqkhYLXtt1BFw" itemSubjectRef="_RLllEHH_Eei9Z4IY4QeFuA"/>
      <model:inputSet id="_WsD6oxszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WsD6ohszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WsD6qRszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WsD6qBszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:outputSet id="_WsD6rRszEeqkhYLXtt1BFw"/>
    </model:ioSpecification>
    <model:dataObject id="DataObject_WsD6oBszEeqkhYLXtt1BFw_RLllDHH_Eei9Z4IY4QeFuA" name="processInstanceToAutomate" isCollection="false" itemSubjectRef="_RLllDHH_Eei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WsD6pxszEeqkhYLXtt1BFw_RLllEHH_Eei9Z4IY4QeFuA" name="amountRequested" isCollection="false" itemSubjectRef="_RLllEHH_Eei9Z4IY4QeFuA"/>
    <model:startEvent id="_RLlAY3H_Eei9Z4IY4QeFuA" name="Start1"/>
    <model:endEvent id="_RLlAaHH_Eei9Z4IY4QeFuA" name="End1">
      <model:terminateEventDefinition id="_WsD6rxszEeqkhYLXtt1BFw"/>
    </model:endEvent>
    <model:userTask id="_RLlAbXH_Eei9Z4IY4QeFuA" name="Bot is running!">
      <model:performer id="_WsEhsBszEeqkhYLXtt1BFw">
        <model:resourceRef>_RLllVnH_Eei9Z4IY4QeFuA</model:resourceRef>
      </model:performer>
    </model:userTask>
    <model:intermediateCatchEvent id="_RLlAgnH_Eei9Z4IY4QeFuA" name="completeLoanThinkTime">
      <model:timerEventDefinition id="eventdef-completeLoanThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % completeLoanMaxTime) + completeLoanMinTime)
</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:serviceTask id="_RLlAinH_Eei9Z4IY4QeFuA" name="Complete Loan" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_WsZR0BszEeqkhYLXtt1BFw">
        <model:dataInput id="_WsZR0RszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_WsZR0xszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_WsZR0hszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WsZR0RszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WsZR1BszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WsZR0xszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WsZR0RszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WsZR1RszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">
import org.bonitasoft.engine.bpm.actor.ActorMember
import org.bonitasoft.engine.bpm.flownode.ActivityInstance
import org.bonitasoft.engine.identity.UserCriterion
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder

List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)

// perform the task
def completeLoanRequestTask = tasks.get(0)
def taskId = completeLoanRequestTask.id
def taskAssigneeId = completeLoanRequestTask.getAssigneeId() 
//def userId = BonitaUsers.getProcessInstanceInitiator(apiAccessor,processInstanceToAutomate).getId()
def contractInput = [&quot;customerDocumentsDocumentInput&quot; : []]

apiAccessor.getProcessAPI().executeUserTask(taskAssigneeId, taskId, contractInput)
</model:from>
          <model:to id="_WsZR1hszEeqkhYLXtt1BFw">getDataInput('_WsZR0RszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:intermediateCatchEvent id="_RLlAnXH_Eei9Z4IY4QeFuA" name="validateLoanThinkTime">
      <model:timerEventDefinition id="eventdef-validateLoanThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % validateLoanMaxTime) + validateLoanMinTime)</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:serviceTask id="_RLlApXH_Eei9Z4IY4QeFuA" name="Validate Loan" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_WsupABszEeqkhYLXtt1BFw">
        <model:dataInput id="_WsupARszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_WsupAxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_WsupAhszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WsupARszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WsupBBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WsupAxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WsupARszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WsupBRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">
import org.bonitasoft.engine.bpm.flownode.ActivityInstance
import org.bonitasoft.engine.bpm.flownode.UserTaskInstance
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder


List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)

// Do not change Task assignee to perform the task

def UserTaskInstance task = tasks.get(0) 
def taskId = task.id
def assigneeId = task.getAssigneeId()

def contractInput = [&quot;documentValidation&quot; : [&quot;allDocumentProvided&quot; : true, &quot;councellorValidation&quot;: true]]

apiAccessor.getProcessAPI().executeUserTask(assigneeId, taskId, contractInput)</model:from>
          <model:to id="_WsupBhszEeqkhYLXtt1BFw">getDataInput('_WsupARszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:exclusiveGateway id="_RLlAuHH_Eei9Z4IY4QeFuA" name="Gateway1" default="_RLllKHH_Eei9Z4IY4QeFuA"/>
    <model:callActivity id="_RLlAvXH_Eei9Z4IY4QeFuA" name="notify credit history" calledElement="_RLlAI3H_Eei9Z4IY4QeFuA">
      <model:ioSpecification id="_Wsv3IxszEeqkhYLXtt1BFw">
        <model:dataInput id="_Wsv3JBszEeqkhYLXtt1BFw" itemSubjectRef="_bsWT8DqzEem5wKdzfklCCw"/>
        <model:inputSet id="_Wsv3JRszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_Wsv3JBszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
      </model:ioSpecification>
      <model:dataInputAssociation id="_WsvQERszEeqkhYLXtt1BFw">
        <model:assignment>
          <model:from id="_WsvQEhszEeqkhYLXtt1BFw">fakeData</model:from>
          <model:to id="_Wsv3IBszEeqkhYLXtt1BFw">aPieceOfData</model:to>
        </model:assignment>
      </model:dataInputAssociation>
      <model:dataInputAssociation id="_Wsv3JhszEeqkhYLXtt1BFw">
        <model:targetRef>_Wsv3JBszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_Wsv3KBszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.util.Map">[
\t&quot;requestId&quot; : String.valueOf(loanDAO.findByCaseId(String.valueOf(processInstanceToAutomate), 0, 1).get(0).caseId),
\t&quot;equifaxBeacon&quot; : &quot;10&quot;,
\t&quot;transunionFico&quot; : &quot;12&quot;,
\t&quot;experianFair&quot; : &quot;9&quot;
]</model:from>
          <model:to xsi:type="model:tFormalExpression" id="_Wsv3JxszEeqkhYLXtt1BFw">_Wsv3JBszEeqkhYLXtt1BFw</model:to>
        </model:assignment>
      </model:dataInputAssociation>
      <model:dataOutputAssociation id="_Wsv3IRszEeqkhYLXtt1BFw"/>
    </model:callActivity>
    <model:dataObject id="DataObject_Wsv3IhszEeqkhYLXtt1BFw_bsWT8DqzEem5wKdzfklCCw" name="fakeData" isCollection="false" itemSubjectRef="_bsWT8DqzEem5wKdzfklCCw"/>
    <model:intermediateCatchEvent id="_RLlAyXH_Eei9Z4IY4QeFuA" name="reviewCreditHistoryThinkTime">
      <model:timerEventDefinition id="eventdef-reviewCreditHistoryThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % reviewHistoryMaxTime) + reviewHistoryMinTime)</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:serviceTask id="_RLlA0XH_Eei9Z4IY4QeFuA" name="Review Customer Credit History" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_WtFOUBszEeqkhYLXtt1BFw">
        <model:dataInput id="_WtFOURszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_WtFOUxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_WtFOUhszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WtFOURszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WtFOVBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WtFOUxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WtFOURszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WtFOVRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">
import org.bonitasoft.engine.bpm.flownode.ActivityInstance
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder


List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)

// Walter Bates perform the task
def taskId = tasks.get(0).id
def walterBatesId = 4L
def contractInput = [&quot;committeeReview&quot; : [&quot;valid&quot; : true]]
apiAccessor.getProcessAPI().assignUserTaskIfNotAssigned(taskId, walterBatesId);
apiAccessor.getProcessAPI().executeUserTask(walterBatesId, taskId, contractInput)</model:from>
          <model:to id="_WtFOVhszEeqkhYLXtt1BFw">getDataInput('_WtFOURszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:exclusiveGateway id="_RLlA5HH_Eei9Z4IY4QeFuA" name="Gateway2"/>
    <model:intermediateCatchEvent id="_RLlA6XH_Eei9Z4IY4QeFuA" name="writeContractThinkTime">
      <model:timerEventDefinition id="eventdef-writeContractThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % writeContractMaxTime) + writeContractMinTime)</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:serviceTask id="_RLlA8XH_Eei9Z4IY4QeFuA" name="Write Contract" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_WtalgBszEeqkhYLXtt1BFw">
        <model:dataInput id="_WtalgRszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_WtalgxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_WtalghszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WtalgRszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WtalhBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WtalgxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WtalgRszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WtalhRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">
import org.bonitasoft.engine.bpm.flownode.ActivityInstance
import org.bonitasoft.engine.bpm.flownode.UserTaskInstance
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder


List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)

// Do not change Task assignee to perform the task

def UserTaskInstance task = tasks.get(0)
def taskId = task.id
def assigneeId = task.getAssigneeId()

def contractInput = [&quot;loanRequestedInput&quot; : [&quot;rate&quot; : 3, &quot;durationInMonth&quot; : 18]]
apiAccessor.getProcessAPI().executeUserTask(assigneeId, taskId, contractInput)</model:from>
          <model:to id="_WtalhhszEeqkhYLXtt1BFw">getDataInput('_WtalgRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:intermediateCatchEvent id="_RLlBBHH_Eei9Z4IY4QeFuA" name="signContractThinkTime">
      <model:timerEventDefinition id="eventdef-signContractThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % signContractMaxTime) + signContractMinTime)</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:serviceTask id="_RLlBDHH_Eei9Z4IY4QeFuA" name="Validate Contract" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_Wt2qYBszEeqkhYLXtt1BFw">
        <model:dataInput id="_Wt2qYRszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_Wt2qYxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_Wt2qYhszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_Wt2qYRszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_Wt2qZBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_Wt2qYxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_Wt2qYRszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_Wt2qZRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">
import org.bonitasoft.engine.bpm.flownode.ActivityInstance
import org.bonitasoft.engine.bpm.flownode.UserTaskInstance
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder


List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)

// Do not change Task assignee to perform the task

def UserTaskInstance task = tasks.get(0)
def taskId = task.id
def assigneeId = task.getAssigneeId()

def contractInput = [&quot;loanRequestedInput&quot; : [&quot;status&quot; : &quot;Loan Approved&quot;]]
apiAccessor.getProcessAPI().executeUserTask(assigneeId, taskId, contractInput)</model:from>
          <model:to id="_Wt2qZhszEeqkhYLXtt1BFw">getDataInput('_Wt2qYRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:intermediateCatchEvent id="_RLlBH3H_Eei9Z4IY4QeFuA" name="notifyCreditHistoryThinkTime">
      <model:timerEventDefinition id="eventdef-notifyCreditHistoryThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % notifyCreditMaxTime) + notifyCreditMinTime)</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:serviceTask id="_RLlBJ3H_Eei9Z4IY4QeFuA" name="SignContract" implementation="BonitaConnector" operationRef="Execscripting-groovy-script">
      <model:ioSpecification id="_WuLagBszEeqkhYLXtt1BFw">
        <model:dataInput id="_WuLagRszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorInput"/>
        <model:dataOutput id="_WuLagxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovy-scriptConnectorOutput"/>
        <model:inputSet id="_WuLaghszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_WuLagRszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_WuLahBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_WuLagxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_WuLagRszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_WuLahRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">
import org.bonitasoft.engine.bpm.flownode.ActivityInstance
import org.bonitasoft.engine.search.SearchOptions
import org.bonitasoft.engine.search.SearchOptionsBuilder


List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)

// Walter Bates perform the task
def taskId = tasks.get(0).id
def initiator = BonitaUsers.getProcessInstanceInitiator(apiAccessor, processInstanceToAutomate).getId()
def contractInput = [&quot;loanRequestedInput&quot; : [&quot;signature&quot; : &quot;written by Nicolas Chabanoles&quot;]]
apiAccessor.getProcessAPI().assignUserTaskIfNotAssigned(taskId, initiator);
apiAccessor.getProcessAPI().executeUserTask(initiator, taskId, contractInput)</model:from>
          <model:to id="_WuLahhszEeqkhYLXtt1BFw">getDataInput('_WuLagRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>
        </model:assignment>
      </model:dataInputAssociation>
    </model:serviceTask>
    <model:intermediateCatchEvent id="_RLllAnH_Eei9Z4IY4QeFuA" name="validateContractThinkTime">
      <model:timerEventDefinition id="eventdef-validateContractThinkTime">
        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % validateContractMaxTime) + validateContractMinTime)</model:timeCycle>
      </model:timerEventDefinition>
    </model:intermediateCatchEvent>
    <model:sequenceFlow id="_RLllHHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAY3H_Eei9Z4IY4QeFuA" targetRef="_RLlAbXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllH3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAgnH_Eei9Z4IY4QeFuA" targetRef="_RLlAinH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllInH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAY3H_Eei9Z4IY4QeFuA" targetRef="_RLlAgnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllJXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAnXH_Eei9Z4IY4QeFuA" targetRef="_RLlApXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllKHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAuHH_Eei9Z4IY4QeFuA" targetRef="_RLlAnXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllK3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAvXH_Eei9Z4IY4QeFuA" targetRef="_RLlAyXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllLnH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAyXH_Eei9Z4IY4QeFuA" targetRef="_RLlA0XH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllMXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlA0XH_Eei9Z4IY4QeFuA" targetRef="_RLlA5HH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllNHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlA5HH_Eei9Z4IY4QeFuA" targetRef="_RLlA6XH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllN3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlA6XH_Eei9Z4IY4QeFuA" targetRef="_RLlA8XH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllOnH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlA8XH_Eei9Z4IY4QeFuA" targetRef="_RLlBBHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllPXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlBBHH_Eei9Z4IY4QeFuA" targetRef="_RLlBJ3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllQHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlBDHH_Eei9Z4IY4QeFuA" targetRef="_RLlAaHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllQ3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAuHH_Eei9Z4IY4QeFuA" targetRef="_RLlBH3H_Eei9Z4IY4QeFuA">
      <model:conditionExpression xsi:type="model:tFormalExpression" id="_WuMBkBszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean" language="http://www.w3.org/1999/XPath">amountRequested >= 100000</model:conditionExpression>
    </model:sequenceFlow>
    <model:sequenceFlow id="_RLllR3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlBH3H_Eei9Z4IY4QeFuA" targetRef="_RLlAvXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllSnH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlBJ3H_Eei9Z4IY4QeFuA" targetRef="_RLllAnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllTXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLllAnH_Eei9Z4IY4QeFuA" targetRef="_RLlBDHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllUHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlAinH_Eei9Z4IY4QeFuA" targetRef="_RLlAuHH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLllU3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlApXH_Eei9Z4IY4QeFuA" targetRef="_RLlA5HH_Eei9Z4IY4QeFuA"/>
  </model:process>
  <model:itemDefinition id="_RLllDHH_Eei9Z4IY4QeFuA" structureRef="java:java.lang.Long"/>
  <model:itemDefinition id="_RLllEHH_Eei9Z4IY4QeFuA" structureRef="java:java.lang.Integer"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:itemDefinition id="_bsWT8DqzEem5wKdzfklCCw" structureRef="java:java.util.Map"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:itemDefinition id="scripting-groovy-scriptConnectorInput" structureRef="bonitaConnector:scripting-groovy-scriptInputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageInput" itemRef="scripting-groovy-scriptConnectorInput"/>
  <model:itemDefinition id="scripting-groovy-scriptConnectorOutput" structureRef="bonitaConnector:scripting-groovy-scriptOutputType"/>
  <model:message id="scripting-groovy-scriptConnectorMessageOutput" itemRef="scripting-groovy-scriptConnectorOutput"/>
  <model:interface id="scripting-groovy-script_Bonita_Connector_Interface" name="scripting-groovy-script_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy-script" name="Execscripting-groovy-script">
      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <model:process id="_RLllnXH_Eei9Z4IY4QeFuA" name="deleteLoanRequest">
    <model:ioSpecification id="_WuNPsRszEeqkhYLXtt1BFw">
      <model:dataInput id="_WuNPshszEeqkhYLXtt1BFw" itemSubjectRef="_RLlly3H_Eei9Z4IY4QeFuA"/>
      <model:dataInput id="_WuNPuBszEeqkhYLXtt1BFw" itemSubjectRef="_RLllzXH_Eei9Z4IY4QeFuA"/>
      <model:inputSet id="_WuNPsxszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuNPshszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WuNPuRszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuNPuBszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:outputSet id="_WuNPvRszEeqkhYLXtt1BFw"/>
    </model:ioSpecification>
    <model:dataObject id="DataObject_WuNPsBszEeqkhYLXtt1BFw_RLlly3H_Eei9Z4IY4QeFuA" name="loanRequestToDelete" isCollection="false" itemSubjectRef="_RLlly3H_Eei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WuNPtxszEeqkhYLXtt1BFw_RLllzXH_Eei9Z4IY4QeFuA" name="loanPersistenceId" isCollection="false" itemSubjectRef="_RLllzXH_Eei9Z4IY4QeFuA"/>
    <model:serviceTask id="_RLllnnH_Eei9Z4IY4QeFuA" name="delete loanRequest"/>
    <model:endEvent id="_RLllrXH_Eei9Z4IY4QeFuA" name="Deletion complete"/>
    <model:serviceTask id="_RLllsnH_Eei9Z4IY4QeFuA" name="findLoanRequest"/>
    <model:startEvent id="_RLllxHH_Eei9Z4IY4QeFuA" name="Start Deletion"/>
    <model:sequenceFlow id="_RLll2XH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLllsnH_Eei9Z4IY4QeFuA" targetRef="_RLllnnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLll3HH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLllnnH_Eei9Z4IY4QeFuA" targetRef="_RLllrXH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLll33H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLllxHH_Eei9Z4IY4QeFuA" targetRef="_RLllsnH_Eei9Z4IY4QeFuA"/>
  </model:process>
  <model:itemDefinition id="_RLlly3H_Eei9Z4IY4QeFuA" structureRef="java:com.company.model.Loan"/>
  <model:itemDefinition id="_RLllzXH_Eei9Z4IY4QeFuA" structureRef="java:java.lang.Long"/>
  <model:process id="_RLlmBXH_Eei9Z4IY4QeFuA" name="updateLoanCaseId">
    <model:ioSpecification id="_WuOd0RszEeqkhYLXtt1BFw">
      <model:dataInput id="_WuOd0hszEeqkhYLXtt1BFw" itemSubjectRef="_RLlmL3H_Eei9Z4IY4QeFuA"/>
      <model:dataInput id="_WuOd2BszEeqkhYLXtt1BFw" itemSubjectRef="_RLlmMXH_Eei9Z4IY4QeFuA"/>
      <model:dataInput id="_WuOd3hszEeqkhYLXtt1BFw" itemSubjectRef="_RLlmNXH_Eei9Z4IY4QeFuA"/>
      <model:inputSet id="_WuOd0xszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuOd0hszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WuOd2RszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuOd2BszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WuOd3xszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuOd3hszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:outputSet id="_WuOd4xszEeqkhYLXtt1BFw"/>
    </model:ioSpecification>
    <model:dataObject id="DataObject_WuOd0BszEeqkhYLXtt1BFw_RLlmL3H_Eei9Z4IY4QeFuA" name="loanRequestToUpdate" isCollection="false" itemSubjectRef="_RLlmL3H_Eei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WuOd1xszEeqkhYLXtt1BFw_RLlmMXH_Eei9Z4IY4QeFuA" name="caseId" isCollection="false" itemSubjectRef="_RLlmMXH_Eei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WuOd3RszEeqkhYLXtt1BFw_RLlmNXH_Eei9Z4IY4QeFuA" name="loanRequestId" isCollection="false" itemSubjectRef="_RLlmNXH_Eei9Z4IY4QeFuA"/>
    <model:startEvent id="_RLlmBnH_Eei9Z4IY4QeFuA" name="Start Update"/>
    <model:serviceTask id="_RLlmC3H_Eei9Z4IY4QeFuA" name="update Loan Request"/>
    <model:serviceTask id="_RLlmG3H_Eei9Z4IY4QeFuA" name="find Loan Request"/>
    <model:sequenceFlow id="_RLlmQXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlmBnH_Eei9Z4IY4QeFuA" targetRef="_RLlmG3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLlmRHH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlmG3H_Eei9Z4IY4QeFuA" targetRef="_RLlmC3H_Eei9Z4IY4QeFuA"/>
  </model:process>
  <model:itemDefinition id="_RLlmL3H_Eei9Z4IY4QeFuA" structureRef="java:com.company.model.Loan"/>
  <model:itemDefinition id="_RLlmMXH_Eei9Z4IY4QeFuA" structureRef="java:java.lang.String"/>
  <model:itemDefinition id="_RLlmNXH_Eei9Z4IY4QeFuA" structureRef="java:java.lang.Long"/>
  <model:process id="_RLlmbHH_Eei9Z4IY4QeFuA" name="generateLoanRequestsBot">
    <model:ioSpecification id="_WuPr8RszEeqkhYLXtt1BFw">
      <model:dataInput id="_WuPr8hszEeqkhYLXtt1BFw" itemSubjectRef="_RLlmmXH_Eei9Z4IY4QeFuA"/>
      <model:dataInput id="_WuPr-BszEeqkhYLXtt1BFw" itemSubjectRef="_RLlmm3H_Eei9Z4IY4QeFuA"/>
      <model:inputSet id="_WuPr8xszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuPr8hszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:inputSet id="_WuPr-RszEeqkhYLXtt1BFw">
        <model:dataInputRefs>_WuPr-BszEeqkhYLXtt1BFw</model:dataInputRefs>
      </model:inputSet>
      <model:outputSet id="_WuPr_RszEeqkhYLXtt1BFw"/>
    </model:ioSpecification>
    <model:dataObject id="DataObject_WuPr8BszEeqkhYLXtt1BFw_RLlmmXH_Eei9Z4IY4QeFuA" name="requestsToCreate" isCollection="false" itemSubjectRef="_RLlmmXH_Eei9Z4IY4QeFuA"/>
    <model:dataObject id="DataObject_WuPr9xszEeqkhYLXtt1BFw_RLlmm3H_Eei9Z4IY4QeFuA" name="numberOfRequestToCreate" isCollection="false" itemSubjectRef="_RLlmm3H_Eei9Z4IY4QeFuA"/>
    <model:startEvent id="_RLlmbXH_Eei9Z4IY4QeFuA" name="Start generation"/>
    <model:serviceTask id="_RLlmcnH_Eei9Z4IY4QeFuA" name="generate random data"/>
    <model:endEvent id="_RLlmgnH_Eei9Z4IY4QeFuA" name="End generation">
      <model:terminateEventDefinition id="_WuPsABszEeqkhYLXtt1BFw"/>
    </model:endEvent>
    <model:serviceTask id="_RLlmh3H_Eei9Z4IY4QeFuA" name="Request Loan" implementation="BonitaConnector" operationRef="Execscripting-groovy">
      <model:ioSpecification id="_Wuj1ABszEeqkhYLXtt1BFw">
        <model:dataInput id="_Wuj1ARszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovyConnectorInput"/>
        <model:dataOutput id="_Wuj1AxszEeqkhYLXtt1BFw" itemSubjectRef="scripting-groovyConnectorOutput"/>
        <model:inputSet id="_Wuj1AhszEeqkhYLXtt1BFw">
          <model:dataInputRefs>_Wuj1ARszEeqkhYLXtt1BFw</model:dataInputRefs>
        </model:inputSet>
        <model:outputSet id="_Wuj1BBszEeqkhYLXtt1BFw">
          <model:dataOutputRefs>_Wuj1AxszEeqkhYLXtt1BFw</model:dataOutputRefs>
        </model:outputSet>
      </model:ioSpecification>
      <model:dataInputAssociation>
        <model:targetRef>_Wuj1ARszEeqkhYLXtt1BFw</model:targetRef>
        <model:assignment>
          <model:from xsi:type="model:tFormalExpression" id="_Wuj1BRszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Object">import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfo
import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfoSearchDescriptor
import org.bonitasoft.engine.identity.UserCriterion
import org.bonitasoft.engine.search.SearchOptionsBuilder
import org.bonitasoft.engine.search.SearchResult

def searchBuilder = new SearchOptionsBuilder(0, 1);
searchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.NAME, &quot;RequestLoan&quot;);
searchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.ACTIVATION_STATE, &quot;ENABLED&quot;);
SearchResult result = apiAccessor.getProcessAPI().searchProcessDeploymentInfos(searchBuilder.done());
ProcessDeploymentInfo requestLoanProcess = (ProcessDeploymentInfo)(result.getResult().get(0));


def userInitiator = apiAccessor.getIdentityAPI().getUsers(0, 50, UserCriterion.USER_NAME_ASC).collect { it.id }
// userInitiator = [21L,10L,14L,2L]
def randomInitiator = new Random()
def idInitiator = userInitiator[randomInitiator.nextInt(userInitiator.size())]

apiAccessor.getProcessAPI().startProcessWithInputs(idInitiator, requestLoanProcess.getProcessId(), [&quot;loanRequestedInput&quot; : multiInstanceIterator])
</model:from>
          <model:to id="_Wuj1BhszEeqkhYLXtt1BFw">getDataInput('_Wuj1ARszEeqkhYLXtt1BFw')/bonitaConnector:script</model:to>
        </model:assignment>
      </model:dataInputAssociation>
      <model:multiInstanceLoopCharacteristics id="_WuPsBBszEeqkhYLXtt1BFw" isSequential="false">
        <model:loopCardinality xsi:type="model:tFormalExpression" id="_WuPsAxszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Integer" language="http://www.w3.org/1999/XPath"></model:loopCardinality>
        <model:completionCondition xsi:type="model:tFormalExpression" id="_WuPsAhszEeqkhYLXtt1BFw" evaluatesToTypeRef="java:java.lang.Boolean" language="http://www.w3.org/1999/XPath"></model:completionCondition>
      </model:multiInstanceLoopCharacteristics>
    </model:serviceTask>
    <model:sequenceFlow id="_RLlmp3H_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlmbXH_Eei9Z4IY4QeFuA" targetRef="_RLlmcnH_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLlmqnH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlmcnH_Eei9Z4IY4QeFuA" targetRef="_RLlmh3H_Eei9Z4IY4QeFuA"/>
    <model:sequenceFlow id="_RLlmrXH_Eei9Z4IY4QeFuA" name="" sourceRef="_RLlmh3H_Eei9Z4IY4QeFuA" targetRef="_RLlmgnH_Eei9Z4IY4QeFuA"/>
  </model:process>
  <model:itemDefinition id="_RLlmmXH_Eei9Z4IY4QeFuA" structureRef="java:java.util.List"/>
  <model:itemDefinition id="_RLlmm3H_Eei9Z4IY4QeFuA" structureRef="java:java.lang.Integer"/>
  <model:itemDefinition id="scripting-groovyConnectorInput" structureRef="bonitaConnector:scripting-groovyInputType"/>
  <model:message id="scripting-groovyConnectorMessageInput" itemRef="scripting-groovyConnectorInput"/>
  <model:itemDefinition id="scripting-groovyConnectorOutput" structureRef="bonitaConnector:scripting-groovyOutputType"/>
  <model:message id="scripting-groovyConnectorMessageOutput" itemRef="scripting-groovyConnectorOutput"/>
  <model:interface id="scripting-groovy_Bonita_Connector_Interface" name="scripting-groovy_Bonita_Connector_Interface">
    <model:operation id="Execscripting-groovy" name="Execscripting-groovy">
      <model:inMessageRef>scripting-groovyConnectorMessageInput</model:inMessageRef>
      <model:outMessageRef>scripting-groovyConnectorMessageOutput</model:outMessageRef>
    </model:operation>
  </model:interface>
  <di:BPMNDiagram name="LoanManagement">
    <di:BPMNPlane id="plane__RLk98HH_Eei9Z4IY4QeFuA" bpmnElement="_RLk98HH_Eei9Z4IY4QeFuA">
      <di:BPMNShape id="_RLlm4XH_Eei9Z4IY4QeFuA" bpmnElement="_WrR3gBszEeqkhYLXtt1BFw" isHorizontal="true">
        <dc:Bounds height="1017.0" width="1748.0" x="0.0" y="0.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm5HH_Eei9Z4IY4QeFuA" bpmnElement="_RLk98nH_Eei9Z4IY4QeFuA" isHorizontal="true">
        <dc:Bounds height="437.0" width="1718.0" x="30.0" y="0.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm6nH_Eei9Z4IY4QeFuA" bpmnElement="_RLk983H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="90.0" y="68.0"/>
        <di:BPMNLabel id="_WrSenxszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="103.0" x="54.0" y="103.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm53H_Eei9Z4IY4QeFuA" bpmnElement="_RLk9-HH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="303.0" y="244.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm7nH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-IHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="1177.0" y="95.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm8HH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-Q3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="1197.0" y="130.0"/>
        <di:BPMNLabel id="_WrTFohszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="140.0" x="1221.0" y="165.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm9XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-TXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="341.0" y="61.0"/>
        <di:BPMNLabel id="_WrTFoxszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="126.0" x="364.0" y="131.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm-XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-UnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="913.0" y="68.0"/>
        <di:BPMNLabel id="_WrTssBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="148.0" x="854.0" y="103.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlm_XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-V3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="683.0" y="53.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnAHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-ZnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="188.0" y="63.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnA3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk-h3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="1167.0" y="228.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnBnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-lnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="1212.0" y="342.0"/>
        <di:BPMNLabel id="_Wrpq8xszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="133.0" x="1161.0" y="377.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnD3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk-n3H_Eei9Z4IY4QeFuA" isHorizontal="true">
        <dc:Bounds height="250.0" width="1718.0" x="30.0" y="437.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnEnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-oHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="460.0" y="494.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnFXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk-z3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="70.0" width="140.0" x="1063.0" y="489.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnGHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_AXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="674.0" y="494.0"/>
        <di:BPMNLabel id="_WrqSAhszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="170.0" x="610.0" y="542.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnHHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_BnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="1276.0" y="499.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnH3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk_MXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="1405.0" y="499.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnInH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_O3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="1557.0" y="509.0"/>
        <di:BPMNLabel id="_WrqSBhszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="170.0" x="1487.0" y="544.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnJnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_QHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="323.0" y="516.0"/>
        <di:BPMNLabel id="_WrqSBxszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="259.0" x="216.0" y="496.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnKnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_RXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="987.0" y="502.0"/>
        <di:BPMNLabel id="_Wrq5EBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="126.0" x="946.0" y="470.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnM3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk_TnH_Eei9Z4IY4QeFuA" isHorizontal="true">
        <dc:Bounds height="330.0" width="1718.0" x="30.0" y="687.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnNnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_T3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="876.0" y="892.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnOXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_dXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="503.0" y="887.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnPHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_hHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="728.0" y="907.0"/>
        <di:BPMNLabel id="_WsA3URszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="170.0" x="669.0" y="879.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnQHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_iXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="906.0" y="768.0"/>
        <di:BPMNLabel id="_WsA3UhszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="163.0" x="1004.0" y="736.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNEdge id="_RLln6XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_pXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="580.0" y="519.0"/>
        <di_1:waypoint x="674.0" y="519.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln7nH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_qHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="717.0" y="501.0"/>
        <di_1:waypoint x="854.0" y="501.0"/>
        <di_1:waypoint x="854.0" y="520.0"/>
        <di_1:waypoint x="987.0" y="520.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln9HH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_rHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1126.0" y="489.0"/>
        <di_1:waypoint x="1126.0" y="114.0"/>
        <di_1:waypoint x="1177.0" y="114.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln-XH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_r3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="288.0" y="82.0"/>
        <di_1:waypoint x="341.0" y="82.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLln_nH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_snH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="120.0" y="79.0"/>
        <di_1:waypoint x="188.0" y="79.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloBXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_tXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="362.0" y="104.0"/>
        <di_1:waypoint x="362.0" y="244.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloCnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_uXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="384.0" y="82.0"/>
        <di_1:waypoint x="683.0" y="82.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloD3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk_vHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="803.0" y="84.0"/>
        <di_1:waypoint x="913.0" y="84.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloFHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_v3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="314.0" y="304.0"/>
        <di_1:waypoint x="314.0" y="419.0"/>
        <di_1:waypoint x="338.0" y="419.0"/>
        <di_1:waypoint x="338.0" y="516.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloG3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk_wnH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="684.0" y="494.0"/>
        <di_1:waypoint x="684.0" y="113.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloIXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_xXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1277.0" y="105.0"/>
        <di_1:waypoint x="1352.0" y="105.0"/>
        <di_1:waypoint x="1352.0" y="499.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloJnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_yHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1199.0" y="160.0"/>
        <di_1:waypoint x="1199.0" y="228.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloK3H_Eei9Z4IY4QeFuA" bpmnElement="_RLk_y3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1226.0" y="288.0"/>
        <di_1:waypoint x="1226.0" y="342.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloMHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_znH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1376.0" y="524.0"/>
        <di_1:waypoint x="1405.0" y="524.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloNXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_0XH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1505.0" y="524.0"/>
        <di_1:waypoint x="1557.0" y="524.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloOnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_1HH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="339.0" y="559.0"/>
        <di_1:waypoint x="339.0" y="914.0"/>
        <di_1:waypoint x="503.0" y="914.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloQHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_2HH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="623.0" y="919.0"/>
        <di_1:waypoint x="728.0" y="919.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloRXH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_23H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="949.0" y="787.0"/>
        <di_1:waypoint x="1006.0" y="787.0"/>
        <di_1:waypoint x="1006.0" y="545.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloSnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_33H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="366.0" y="530.0"/>
        <di_1:waypoint x="460.0" y="530.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloUHH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_4nH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="906.0" y="784.0"/>
        <di_1:waypoint x="767.0" y="784.0"/>
        <di_1:waypoint x="767.0" y="113.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloVnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_5XH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="900.0" y="892.0"/>
        <di_1:waypoint x="900.0" y="849.0"/>
        <di_1:waypoint x="917.0" y="849.0"/>
        <di_1:waypoint x="917.0" y="811.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloZnH_Eei9Z4IY4QeFuA" bpmnElement="_RLk_63H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1030.0" y="523.0"/>
        <di_1:waypoint x="1063.0" y="523.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_ivfXUHPFEeiw3J4-SJPrKA" bpmnElement="_iveJMHPFEeiw3J4-SJPrKA">
        <di_1:waypoint x="758.0" y="919.0"/>
        <di_1:waypoint x="876.0" y="919.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNShape id="_RLlnTnH_Eei9Z4IY4QeFuA" bpmnElement="_WsCsgBszEeqkhYLXtt1BFw" isHorizontal="true">
        <dc:Bounds height="250.0" width="824.0" x="0.0" y="1067.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnUXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAJHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="97.0" y="1168.0"/>
        <di:BPMNLabel id="_WsDTkBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="178.0" x="23.0" y="1203.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_zfYu4Ba7EeqF6b6kCtCpmA" bpmnElement="_zfYH0Ba7EeqF6b6kCtCpmA">
        <dc:Bounds height="30.0" width="30.0" x="720.0" y="1168.0"/>
        <di:BPMNLabel id="_WsDTkhszEeqkhYLXtt1BFw" labelStyle="_WsDTkRszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="140.0" x="665.0" y="1203.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNEdge id="_RLloYXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAPnH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="127.0" y="1183.0"/>
        <di_1:waypoint x="720.0" y="1183.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNShape id="_RLlnXnH_Eei9Z4IY4QeFuA" bpmnElement="_WsDTkxszEeqkhYLXtt1BFw" isHorizontal="true">
        <dc:Bounds height="622.0" width="2175.0" x="0.0" y="1367.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnYXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAY3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="84.0" y="1427.0"/>
        <di:BPMNLabel id="_WsD6rhszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="44.0" x="77.0" y="1462.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnZXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAaHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="1832.0" y="1475.0"/>
        <di:BPMNLabel id="_WsD6sBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="29.0" x="1833.0" y="1510.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnaXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAbXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="49.0" y="1550.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnbHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAgnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="178.0" y="1427.0"/>
        <di:BPMNLabel id="_WsEhshszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="155.0" x="116.0" y="1462.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlncHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAinH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="260.0" y="1417.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnc3H_Eei9Z4IY4QeFuA" bpmnElement="_RLlAnXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="521.0" y="1427.0"/>
        <di:BPMNLabel id="_WsZ44BszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="155.0" x="459.0" y="1462.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnd3H_Eei9Z4IY4QeFuA" bpmnElement="_RLlApXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="613.0" y="1417.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnenH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAuHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="426.0" y="1420.0"/>
        <di:BPMNLabel id="_WsvQEBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="59.0" x="418.0" y="1468.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnfnH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAvXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="398.0" y="1626.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlngXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlAyXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="443.0" y="1740.0"/>
        <di:BPMNLabel id="_Wsv3KhszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="207.0" x="355.0" y="1775.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnhXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlA0XH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="398.0" y="1835.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlniHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlA5HH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="43.0" width="43.0" x="792.0" y="1433.0"/>
        <di:BPMNLabel id="_WtFOWBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="59.0" x="784.0" y="1481.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnjHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlA6XH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="882.0" y="1427.0"/>
        <di:BPMNLabel id="_WtFOWRszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="163.0" x="816.0" y="1462.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnkHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlA8XH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="977.0" y="1417.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnk3H_Eei9Z4IY4QeFuA" bpmnElement="_RLlBBHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="1129.0" y="1417.0"/>
        <di:BPMNLabel id="_WtaliBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="155.0" x="1067.0" y="1452.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnl3H_Eei9Z4IY4QeFuA" bpmnElement="_RLlBDHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="1585.0" y="1475.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnmnH_Eei9Z4IY4QeFuA" bpmnElement="_RLlBH3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="443.0" y="1529.0"/>
        <di:BPMNLabel id="_Wt2qaBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="207.0" x="355.0" y="1564.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnnnH_Eei9Z4IY4QeFuA" bpmnElement="_RLlBJ3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="1224.0" y="1417.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnoXH_Eei9Z4IY4QeFuA" bpmnElement="_RLllAnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="1376.0" y="1417.0"/>
        <di:BPMNLabel id="_WuLaiBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="185.0" x="1299.0" y="1452.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNEdge id="_RLloa3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllHHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="102.0" y="1457.0"/>
        <di_1:waypoint x="102.0" y="1550.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlocXH_Eei9Z4IY4QeFuA" bpmnElement="_RLllH3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="208.0" y="1442.0"/>
        <di_1:waypoint x="260.0" y="1442.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloeHH_Eei9Z4IY4QeFuA" bpmnElement="_RLllInH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="114.0" y="1442.0"/>
        <di_1:waypoint x="178.0" y="1442.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlof3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllJXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="551.0" y="1442.0"/>
        <di_1:waypoint x="613.0" y="1442.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlohnH_Eei9Z4IY4QeFuA" bpmnElement="_RLllKHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="469.0" y="1441.0"/>
        <di_1:waypoint x="521.0" y="1441.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlojXH_Eei9Z4IY4QeFuA" bpmnElement="_RLllK3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="458.0" y="1686.0"/>
        <di_1:waypoint x="458.0" y="1740.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlolHH_Eei9Z4IY4QeFuA" bpmnElement="_RLllLnH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="458.0" y="1770.0"/>
        <di_1:waypoint x="458.0" y="1835.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlom3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllMXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="518.0" y="1855.0"/>
        <di_1:waypoint x="856.0" y="1855.0"/>
        <di_1:waypoint x="856.0" y="1805.0"/>
        <di_1:waypoint x="816.0" y="1805.0"/>
        <di_1:waypoint x="816.0" y="1476.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlooXH_Eei9Z4IY4QeFuA" bpmnElement="_RLllNHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="835.0" y="1448.0"/>
        <di_1:waypoint x="882.0" y="1448.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloqHH_Eei9Z4IY4QeFuA" bpmnElement="_RLllN3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="912.0" y="1442.0"/>
        <di_1:waypoint x="977.0" y="1442.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlor3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllOnH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1077.0" y="1437.0"/>
        <di_1:waypoint x="1129.0" y="1437.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlotnH_Eei9Z4IY4QeFuA" bpmnElement="_RLllPXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1159.0" y="1437.0"/>
        <di_1:waypoint x="1224.0" y="1437.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlovXH_Eei9Z4IY4QeFuA" bpmnElement="_RLllQHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1685.0" y="1488.0"/>
        <di_1:waypoint x="1832.0" y="1488.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlow3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllQ3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="452.0" y="1463.0"/>
        <di_1:waypoint x="452.0" y="1529.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLloynH_Eei9Z4IY4QeFuA" bpmnElement="_RLllR3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="458.0" y="1559.0"/>
        <di_1:waypoint x="458.0" y="1626.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlo0XH_Eei9Z4IY4QeFuA" bpmnElement="_RLllSnH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1324.0" y="1437.0"/>
        <di_1:waypoint x="1376.0" y="1437.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlo2HH_Eei9Z4IY4QeFuA" bpmnElement="_RLllTXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="1406.0" y="1436.0"/>
        <di_1:waypoint x="1485.0" y="1436.0"/>
        <di_1:waypoint x="1485.0" y="1487.0"/>
        <di_1:waypoint x="1585.0" y="1487.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLmMI3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllUHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="360.0" y="1441.0"/>
        <di_1:waypoint x="426.0" y="1441.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLmMKnH_Eei9Z4IY4QeFuA" bpmnElement="_RLllU3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="713.0" y="1448.0"/>
        <di_1:waypoint x="792.0" y="1448.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNShape id="_RLlnwHH_Eei9Z4IY4QeFuA" bpmnElement="_WuMooBszEeqkhYLXtt1BFw" isHorizontal="true">
        <dc:Bounds height="250.0" width="0.0" x="0.0" y="2039.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnw3H_Eei9Z4IY4QeFuA" bpmnElement="_RLllnnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="313.0" y="2131.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnxnH_Eei9Z4IY4QeFuA" bpmnElement="_RLllrXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="540.0" y="2131.0"/>
        <di:BPMNLabel id="_WuNPvxszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="126.0" x="492.0" y="2166.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnynH_Eei9Z4IY4QeFuA" bpmnElement="_RLllsnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="122.0" y="2131.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnzXH_Eei9Z4IY4QeFuA" bpmnElement="_RLllxHH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="39.0" y="2145.0"/>
        <di:BPMNLabel id="_WuN2wBszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="103.0" x="3.0" y="2180.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNEdge id="_RLlo3nH_Eei9Z4IY4QeFuA" bpmnElement="_RLll2XH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="222.0" y="2156.0"/>
        <di_1:waypoint x="313.0" y="2156.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLlo43H_Eei9Z4IY4QeFuA" bpmnElement="_RLll3HH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="413.0" y="2151.0"/>
        <di_1:waypoint x="540.0" y="2151.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLmME3H_Eei9Z4IY4QeFuA" bpmnElement="_RLll33H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="69.0" y="2154.0"/>
        <di_1:waypoint x="114.0" y="2154.0"/>
        <di_1:waypoint x="114.0" y="2137.0"/>
        <di_1:waypoint x="122.0" y="2137.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNShape id="_RLln1nH_Eei9Z4IY4QeFuA" bpmnElement="_WuN2wRszEeqkhYLXtt1BFw" isHorizontal="true">
        <dc:Bounds height="250.0" width="0.0" x="0.0" y="2339.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLln2XH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmBnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="68.0" y="2427.0"/>
        <di:BPMNLabel id="_WuOd5BszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="89.0" x="39.0" y="2462.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLln3XH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmC3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="50.0" width="100.0" x="388.0" y="2427.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLln4HH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmG3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="141.0" y="2417.0"/>
      </di:BPMNShape>
      <di:BPMNEdge id="_RLmMGXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmQXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="98.0" y="2444.0"/>
        <di_1:waypoint x="141.0" y="2444.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLmMHnH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmRHH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="261.0" y="2449.0"/>
        <di_1:waypoint x="388.0" y="2449.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNShape id="_RLlnqnH_Eei9Z4IY4QeFuA" bpmnElement="_WuPE4BszEeqkhYLXtt1BFw" isHorizontal="true">
        <dc:Bounds height="250.0" width="0.0" x="0.0" y="2639.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnrXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmbXH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="65.0" y="2783.0"/>
        <di:BPMNLabel id="_WuPr_hszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="118.0" x="21.0" y="2818.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnsXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmcnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="60.0" width="120.0" x="214.0" y="2768.0"/>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlntHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmgnH_Eei9Z4IY4QeFuA">
        <dc:Bounds height="30.0" width="30.0" x="778.0" y="2783.0"/>
        <di:BPMNLabel id="_WuPsARszEeqkhYLXtt1BFw" labelStyle="_WrSenhszEeqkhYLXtt1BFw">
          <dc:Bounds height="17.0" width="103.0" x="742.0" y="2818.0"/>
        </di:BPMNLabel>
      </di:BPMNShape>
      <di:BPMNShape id="_RLlnuHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmh3H_Eei9Z4IY4QeFuA">
        <dc:Bounds height="77.0" width="154.0" x="450.0" y="2759.0"/>
      </di:BPMNShape>
      <di:BPMNEdge id="_RLmMMXH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmp3H_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="95.0" y="2798.0"/>
        <di_1:waypoint x="214.0" y="2798.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLmMNnH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmqnH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="334.0" y="2794.0"/>
        <di_1:waypoint x="450.0" y="2794.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
      <di:BPMNEdge id="_RLmMPHH_Eei9Z4IY4QeFuA" bpmnElement="_RLlmrXH_Eei9Z4IY4QeFuA">
        <di_1:waypoint x="604.0" y="2806.0"/>
        <di_1:waypoint x="778.0" y="2806.0"/>
        <di:BPMNLabel/>
      </di:BPMNEdge>
    </di:BPMNPlane>
    <di:BPMNLabelStyle id="_WrSenhszEeqkhYLXtt1BFw">
      <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Ubuntu" size="9.0"/>
    </di:BPMNLabelStyle>
    <di:BPMNLabelStyle id="_WsDTkRszEeqkhYLXtt1BFw">
      <dc:Font isBold="false" isItalic="false" isStrikeThrough="false" isUnderline="false" name="Segoe UI" size="9.0"/>
    </di:BPMNLabelStyle>
  </di:BPMNDiagram>
</model:definitions>`;
