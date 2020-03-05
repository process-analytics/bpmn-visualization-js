export const xmlContent =
  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
"<model:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bonitaConnector=\"http://www.bonitasoft.org/studio/connector/definition/6.0\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:di_1=\"http://www.omg.org/spec/DD/20100524/DI\" xmlns:java=\"http://jcp.org/en/jsr/detail?id=270\" xmlns:model=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xsi:schemaLocation=\"schemaLocation http://www.omg.org/spec/BPMN/20100524/MODEL schemas/BPMN20.xsd\" exporter=\"BonitaSoft\" exporterVersion=\"7.9.4\" expressionLanguage=\"http://groovy.apache.org/\" targetNamespace=\"http://bonitasoft.com/_RLk98HH_Eei9Z4IY4QeFuA\">\n" +
"  <model:import importType=\"http://www.w3.org/2001/XMLSchema\" location=\"connectorDefs/scripting-groovy.defconnectors.xsd\" namespace=\"http://www.bonitasoft.org/studio/connector/definition/6.0\"/>\n" +
"  <model:import importType=\"http://www.w3.org/2001/XMLSchema\" location=\"connectorDefs/scripting-groovy-script.defconnectors.xsd\" namespace=\"http://www.bonitasoft.org/studio/connector/definition/6.0\"/>\n" +
"  <model:collaboration id=\"_RLk98HH_Eei9Z4IY4QeFuA\">\n" +
"    <model:participant id=\"_WrR3gBszEeqkhYLXtt1BFw\" name=\"RequestLoan\" processRef=\"_RLk98XH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:participant id=\"_RLk_7nH_Eei9Z4IY4QeFuA\" name=\"Employee actor\">\n" +
"      <model:documentation>This is an example of actor that is mapped to any ACME users</model:documentation>\n" +
"    </model:participant>\n" +
"    <model:participant id=\"_WsCsgBszEeqkhYLXtt1BFw\" name=\"Notify Credit History Available\" processRef=\"_RLlAI3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:participant id=\"_RLlAQXH_Eei9Z4IY4QeFuA\" name=\"Employee\"/>\n" +
"    <model:participant id=\"_WsDTkxszEeqkhYLXtt1BFw\" name=\"LoanRequestBot\" processRef=\"_RLlAYnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:participant id=\"_RLllVnH_Eei9Z4IY4QeFuA\" name=\"Employee\"/>\n" +
"    <model:participant id=\"_WuMooBszEeqkhYLXtt1BFw\" name=\"deleteLoanRequest\" processRef=\"_RLllnXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:participant id=\"_RLll4nH_Eei9Z4IY4QeFuA\" name=\"Employee\"/>\n" +
"    <model:participant id=\"_WuN2wRszEeqkhYLXtt1BFw\" name=\"updateLoanCaseId\" processRef=\"_RLlmBXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:participant id=\"_RLlmR3H_Eei9Z4IY4QeFuA\" name=\"Employee\"/>\n" +
"    <model:participant id=\"_WuPE4BszEeqkhYLXtt1BFw\" name=\"generateLoanRequestsBot\" processRef=\"_RLlmbHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:participant id=\"_RLlmsHH_Eei9Z4IY4QeFuA\" name=\"Employye\"/>\n" +
"    <model:messageFlow id=\"_hWPYMBa7EeqF6b6kCtCpmA\" sourceRef=\"_zfYH0Ba7EeqF6b6kCtCpmA\" targetRef=\"_RLk_hHH_Eei9Z4IY4QeFuA\"/>\n" +
"  </model:collaboration>\n" +
"  <model:process id=\"_RLk98XH_Eei9Z4IY4QeFuA\" name=\"RequestLoan\">\n" +
"    <model:ioSpecification id=\"_WrR3ghszEeqkhYLXtt1BFw\">\n" +
"      <model:dataInput id=\"_WrR3gxszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLk_mHH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WrSekhszEeqkhYLXtt1BFw\" itemSubjectRef=\"_P98VQHJDEei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WrSemBszEeqkhYLXtt1BFw\" itemSubjectRef=\"_wl9KIHPAEeiw3J4-SJPrKA\"/>\n" +
"      <model:inputSet id=\"_WrR3hBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WrR3gxszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WrSekxszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WrSekhszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WrSemRszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WrSemBszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:outputSet id=\"_WrSenRszEeqkhYLXtt1BFw\"/>\n" +
"    </model:ioSpecification>\n" +
"    <model:laneSet id=\"RequestLoan_laneSet\">\n" +
"      <model:lane id=\"_RLk98nH_Eei9Z4IY4QeFuA\" name=\"Customer\">\n" +
"        <model:flowNodeRef>_RLk983H_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk9-HH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-IHH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-TXH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-UnH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-V3H_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-ZnH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-h3H_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-lnH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"      </model:lane>\n" +
"      <model:lane id=\"_RLk-n3H_Eei9Z4IY4QeFuA\" name=\"Customer Councellor\">\n" +
"        <model:flowNodeRef>_RLk-oHH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk-z3H_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_AXH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_BnH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_MXH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_O3H_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_QHH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_RXH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"      </model:lane>\n" +
"      <model:lane id=\"_RLk_TnH_Eei9Z4IY4QeFuA\" name=\"Validation Committee\">\n" +
"        <model:flowNodeRef>_RLk_T3H_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_dXH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_hHH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"        <model:flowNodeRef>_RLk_iXH_Eei9Z4IY4QeFuA</model:flowNodeRef>\n" +
"      </model:lane>\n" +
"    </model:laneSet>\n" +
"    <model:dataObject id=\"DataObject_WrR3gRszEeqkhYLXtt1BFw_RLk_mHH_Eei9Z4IY4QeFuA\" name=\"loanRequested\" isCollection=\"false\" itemSubjectRef=\"_RLk_mHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WrSekRszEeqkhYLXtt1BFw_P98VQHJDEei9Z4IY4QeFuA\" name=\"currentProcessVersion\" isCollection=\"false\" itemSubjectRef=\"_P98VQHJDEei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WrSelxszEeqkhYLXtt1BFw_wl9KIHPAEeiw3J4-SJPrKA\" name=\"bankHistoryToReview\" isCollection=\"false\" itemSubjectRef=\"_wl9KIHPAEeiw3J4-SJPrKA\"/>\n" +
"    <model:startEvent id=\"_RLk983H_Eei9Z4IY4QeFuA\" name=\"Request a Loan\"/>\n" +
"    <model:userTask id=\"_RLk9-HH_Eei9Z4IY4QeFuA\" name=\"Complete Loan application\"/>\n" +
"    <model:userTask id=\"_RLk-IHH_Eei9Z4IY4QeFuA\" name=\"Sign contract\"/>\n" +
"    <model:boundaryEvent id=\"_RLk-Q3H_Eei9Z4IY4QeFuA\" name=\"Loan offer expiracy\" attachedToRef=\"_RLk-IHH_Eei9Z4IY4QeFuA\" cancelActivity=\"true\">\n" +
"      <model:timerEventDefinition id=\"eventdef-Loan offer expiracy\">\n" +
"        <model:timeCycle>2592000000L</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:boundaryEvent>\n" +
"    <model:exclusiveGateway id=\"_RLk-TXH_Eei9Z4IY4QeFuA\" name=\"Scoring favorable\" default=\"_RLk_uXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:endEvent id=\"_RLk-UnH_Eei9Z4IY4QeFuA\" name=\"KO - Request refused\">\n" +
"      <model:terminateEventDefinition id=\"_WrTFpBszEeqkhYLXtt1BFw\"/>\n" +
"    </model:endEvent>\n" +
"    <model:serviceTask id=\"_RLk-V3H_Eei9Z4IY4QeFuA\" name=\"Notify negative decision\"/>\n" +
"    <model:serviceTask id=\"_RLk-ZnH_Eei9Z4IY4QeFuA\" name=\"Loan Scoring\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy\">\n" +
"      <model:ioSpecification id=\"_WrpD4BszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WrpD4RszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovyConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WrpD4xszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovyConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WrpD4hszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WrpD4RszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WrpD5BszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WrpD4xszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WrpD4RszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WrpD5RszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfo\n" +
"import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfoSearchDescriptor\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"import org.bonitasoft.engine.search.SearchResult\n" +
"\n" +
"if(botActivated) {\n" +
"\t\n" +
"\t\n" +
"\tdef searchBuilder = new SearchOptionsBuilder(0, 1);\n" +
"\tsearchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.NAME, &quot;LoanRequestBot&quot;);\n" +
"\tsearchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.ACTIVATION_STATE, &quot;ENABLED&quot;);\n" +
"\tSearchResult searchResult = apiAccessor.getProcessAPI().searchProcessDeploymentInfos(searchBuilder.done());\n" +
"\tdef processDefinitionId = searchResult.result.get(0).processId\n" +
"\t\n" +
"\tdef instantiationInputs = new HashMap();\n" +
"\tinstantiationInputs.put(&quot;processInstanceIdInput&quot;, processInstanceId)\n" +
"\tinstantiationInputs.put(&quot;amountInput&quot;, loanRequested.amount)\n" +
"\t\n" +
"\tapiAccessor.getProcessAPI().startProcessWithInputs(processDefinitionId, instantiationInputs)\n" +
"}</model:from>\n" +
"          <model:to id=\"_WrpD5hszEeqkhYLXtt1BFw\">getDataInput('_WrpD4RszEeqkhYLXtt1BFw')/bonitaConnector:script</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:serviceTask id=\"_RLk-h3H_Eei9Z4IY4QeFuA\" name=\"Notify offer expiracy\"/>\n" +
"    <model:endEvent id=\"_RLk-lnH_Eei9Z4IY4QeFuA\" name=\"KO - Offer expired\">\n" +
"      <model:terminateEventDefinition id=\"_Wrpq8hszEeqkhYLXtt1BFw\"/>\n" +
"    </model:endEvent>\n" +
"    <model:userTask id=\"_RLk-oHH_Eei9Z4IY4QeFuA\" name=\"Validate Loan application\"/>\n" +
"    <model:userTask id=\"_RLk-z3H_Eei9Z4IY4QeFuA\" name=\"Write loan contract with Duration and Loan Rate\"/>\n" +
"    <model:exclusiveGateway id=\"_RLk_AXH_Eei9Z4IY4QeFuA\" name=\"accepted by councellor?\" default=\"_RLk_wnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:userTask id=\"_RLk_BnH_Eei9Z4IY4QeFuA\" name=\"Validate Contract\"/>\n" +
"    <model:serviceTask id=\"_RLk_MXH_Eei9Z4IY4QeFuA\" name=\"Credit funds\"/>\n" +
"    <model:endEvent id=\"_RLk_O3H_Eei9Z4IY4QeFuA\" name=\"Success - Loan accepted\">\n" +
"      <model:terminateEventDefinition id=\"_WrqSBRszEeqkhYLXtt1BFw\"/>\n" +
"    </model:endEvent>\n" +
"    <model:exclusiveGateway id=\"_RLk_QHH_Eei9Z4IY4QeFuA\" name=\"requires validation from committee?\" default=\"_RLk_33H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:exclusiveGateway id=\"_RLk_RXH_Eei9Z4IY4QeFuA\" name=\"request validated\"/>\n" +
"    <model:userTask id=\"_RLk_T3H_Eei9Z4IY4QeFuA\" name=\"Review Customer Credit History\"/>\n" +
"    <model:serviceTask id=\"_RLk_dXH_Eei9Z4IY4QeFuA\" name=\"Request Credit History\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_WsAQQBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WsAQQRszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WsAQQxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WsAQQhszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WsAQQRszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WsAQRBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WsAQQxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WsAQQRszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WsAQRRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">&quot;&quot;</model:from>\n" +
"          <model:to id=\"_WsAQRhszEeqkhYLXtt1BFw\">getDataInput('_WsAQQRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"      <model:dataOutputAssociation>\n" +
"        <model:targetRef>_WsAQQxszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from id=\"_WsAQRxszEeqkhYLXtt1BFw\">getDataOutput('_WsAQQRszEeqkhYLXtt1BFw')/bonitaConnector:result</model:from>\n" +
"          <model:to xsi:type=\"model:tFormalExpression\" id=\"_WsAQSBszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:com.company.model.Loan\" language=\"http://www.w3.org/1999/XPath\">getDataObject('_RLk_mHH_Eei9Z4IY4QeFuA')</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataOutputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:intermediateCatchEvent id=\"_RLk_hHH_Eei9Z4IY4QeFuA\" name=\"Credit History Received\">\n" +
"      <model:eventDefinitionRef>creditHistory</model:eventDefinitionRef>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:exclusiveGateway id=\"_RLk_iXH_Eei9Z4IY4QeFuA\" name=\"Credit History Cleared\" default=\"_RLk_4nH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_pXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-oHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_AXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_qHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_AXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_RXH_Eei9Z4IY4QeFuA\">\n" +
"      <model:conditionExpression xsi:type=\"model:tFormalExpression\" id=\"_WsA3UxszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Boolean\">&quot;Accepted By Councellor&quot;.equals(loanRequested.status)</model:conditionExpression>\n" +
"    </model:sequenceFlow>\n" +
"    <model:sequenceFlow id=\"_RLk_rHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-z3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-IHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_r3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-ZnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-TXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_snH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk983H_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-ZnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_tXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-TXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk9-HH_Eei9Z4IY4QeFuA\">\n" +
"      <model:conditionExpression xsi:type=\"model:tFormalExpression\" id=\"_WsBeYBszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Boolean\" language=\"http://www.w3.org/1999/XPath\">isLoanScoringFavorable</model:conditionExpression>\n" +
"    </model:sequenceFlow>\n" +
"    <model:sequenceFlow id=\"_RLk_uXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-TXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-V3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_vHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-V3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-UnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_v3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk9-HH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_QHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_wnH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_AXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-V3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_xXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-IHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_BnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_yHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-Q3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-h3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_y3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk-h3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-lnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_znH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_BnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_MXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_0XH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_MXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_O3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_1HH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_QHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_dXH_Eei9Z4IY4QeFuA\">\n" +
"      <model:conditionExpression xsi:type=\"model:tFormalExpression\" id=\"_WsCFcBszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Boolean\">loanRequested.amount >= 100000</model:conditionExpression>\n" +
"    </model:sequenceFlow>\n" +
"    <model:sequenceFlow id=\"_RLk_2HH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_dXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_hHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_23H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_iXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_RXH_Eei9Z4IY4QeFuA\">\n" +
"      <model:conditionExpression xsi:type=\"model:tFormalExpression\" id=\"_WsCFcRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Boolean\">&quot;Contract to be written&quot;.equals(loanRequested.status)</model:conditionExpression>\n" +
"    </model:sequenceFlow>\n" +
"    <model:sequenceFlow id=\"_RLk_33H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_QHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-oHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_4nH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_iXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-V3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_5XH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_T3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_iXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLk_63H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLk_RXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk-z3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_iveJMHPFEeiw3J4-SJPrKA\" name=\"\" sourceRef=\"_RLk_hHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLk_T3H_Eei9Z4IY4QeFuA\"/>\n" +
"  </model:process>\n" +
"  <model:itemDefinition id=\"_RLk_mHH_Eei9Z4IY4QeFuA\" structureRef=\"java:com.company.model.Loan\"/>\n" +
"  <model:itemDefinition id=\"_P98VQHJDEei9Z4IY4QeFuA\" structureRef=\"java:java.lang.String\"/>\n" +
"  <model:itemDefinition id=\"_wl9KIHPAEeiw3J4-SJPrKA\" structureRef=\"java:com.company.model.BankHistory\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovyConnectorInput\" structureRef=\"bonitaConnector:scripting-groovyInputType\"/>\n" +
"  <model:message id=\"scripting-groovyConnectorMessageInput\" itemRef=\"scripting-groovyConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovyConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovyOutputType\"/>\n" +
"  <model:message id=\"scripting-groovyConnectorMessageOutput\" itemRef=\"scripting-groovyConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy_Bonita_Connector_Interface\" name=\"scripting-groovy_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy\" name=\"Execscripting-groovy\">\n" +
"      <model:inMessageRef>scripting-groovyConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovyConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:process id=\"_RLlAI3H_Eei9Z4IY4QeFuA\" name=\"Notify Credit History Available\">\n" +
"    <model:ioSpecification id=\"_WsCsghszEeqkhYLXtt1BFw\">\n" +
"      <model:dataInput id=\"_WsCsgxszEeqkhYLXtt1BFw\" itemSubjectRef=\"_ySuc8HMbEeiaCON5fHzqCA\"/>\n" +
"      <model:dataInput id=\"_WsCsiRszEeqkhYLXtt1BFw\" itemSubjectRef=\"_OEhlIHO6Eeiw3J4-SJPrKA\"/>\n" +
"      <model:inputSet id=\"_WsCshBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WsCsgxszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WsCsihszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WsCsiRszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:outputSet id=\"_WsCsjhszEeqkhYLXtt1BFw\"/>\n" +
"    </model:ioSpecification>\n" +
"    <model:dataObject id=\"DataObject_WsCsgRszEeqkhYLXtt1BFw_ySuc8HMbEeiaCON5fHzqCA\" name=\"requestID\" isCollection=\"false\" itemSubjectRef=\"_ySuc8HMbEeiaCON5fHzqCA\"/>\n" +
"    <model:dataObject id=\"DataObject_WsCsiBszEeqkhYLXtt1BFw_OEhlIHO6Eeiw3J4-SJPrKA\" name=\"contractInfo\" isCollection=\"false\" itemSubjectRef=\"_OEhlIHO6Eeiw3J4-SJPrKA\"/>\n" +
"    <model:startEvent id=\"_RLlAJHH_Eei9Z4IY4QeFuA\" name=\"Credit History Available\"/>\n" +
"    <model:endEvent id=\"_zfYH0Ba7EeqF6b6kCtCpmA\" name=\"Send Credit History\">\n" +
"      <model:messageEventDefinition id=\"event-defcreditHistory\"/>\n" +
"    </model:endEvent>\n" +
"    <model:sequenceFlow id=\"_RLlAPnH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAJHH_Eei9Z4IY4QeFuA\" targetRef=\"_zfYH0Ba7EeqF6b6kCtCpmA\"/>\n" +
"  </model:process>\n" +
"  <model:itemDefinition id=\"_ySuc8HMbEeiaCON5fHzqCA\" structureRef=\"java:java.lang.String\"/>\n" +
"  <model:itemDefinition id=\"_OEhlIHO6Eeiw3J4-SJPrKA\" structureRef=\"java:java.util.Map\"/>\n" +
"  <model:process id=\"_RLlAYnH_Eei9Z4IY4QeFuA\" name=\"LoanRequestBot\">\n" +
"    <model:ioSpecification id=\"_WsD6oRszEeqkhYLXtt1BFw\">\n" +
"      <model:dataInput id=\"_WsD6ohszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLllDHH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WsD6qBszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLllEHH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:inputSet id=\"_WsD6oxszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WsD6ohszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WsD6qRszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WsD6qBszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:outputSet id=\"_WsD6rRszEeqkhYLXtt1BFw\"/>\n" +
"    </model:ioSpecification>\n" +
"    <model:dataObject id=\"DataObject_WsD6oBszEeqkhYLXtt1BFw_RLllDHH_Eei9Z4IY4QeFuA\" name=\"processInstanceToAutomate\" isCollection=\"false\" itemSubjectRef=\"_RLllDHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WsD6pxszEeqkhYLXtt1BFw_RLllEHH_Eei9Z4IY4QeFuA\" name=\"amountRequested\" isCollection=\"false\" itemSubjectRef=\"_RLllEHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:startEvent id=\"_RLlAY3H_Eei9Z4IY4QeFuA\" name=\"Start1\"/>\n" +
"    <model:endEvent id=\"_RLlAaHH_Eei9Z4IY4QeFuA\" name=\"End1\">\n" +
"      <model:terminateEventDefinition id=\"_WsD6rxszEeqkhYLXtt1BFw\"/>\n" +
"    </model:endEvent>\n" +
"    <model:userTask id=\"_RLlAbXH_Eei9Z4IY4QeFuA\" name=\"Bot is running!\">\n" +
"      <model:performer id=\"_WsEhsBszEeqkhYLXtt1BFw\">\n" +
"        <model:resourceRef>_RLllVnH_Eei9Z4IY4QeFuA</model:resourceRef>\n" +
"      </model:performer>\n" +
"    </model:userTask>\n" +
"    <model:intermediateCatchEvent id=\"_RLlAgnH_Eei9Z4IY4QeFuA\" name=\"completeLoanThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-completeLoanThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % completeLoanMaxTime) + completeLoanMinTime)\n" +
"</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:serviceTask id=\"_RLlAinH_Eei9Z4IY4QeFuA\" name=\"Complete Loan\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_WsZR0BszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WsZR0RszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WsZR0xszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WsZR0hszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WsZR0RszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WsZR1BszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WsZR0xszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WsZR0RszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WsZR1RszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">\n" +
"import org.bonitasoft.engine.bpm.actor.ActorMember\n" +
"import org.bonitasoft.engine.bpm.flownode.ActivityInstance\n" +
"import org.bonitasoft.engine.identity.UserCriterion\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"\n" +
"List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)\n" +
"\n" +
"// perform the task\n" +
"def completeLoanRequestTask = tasks.get(0)\n" +
"def taskId = completeLoanRequestTask.id\n" +
"def taskAssigneeId = completeLoanRequestTask.getAssigneeId() \n" +
"//def userId = BonitaUsers.getProcessInstanceInitiator(apiAccessor,processInstanceToAutomate).getId()\n" +
"def contractInput = [&quot;customerDocumentsDocumentInput&quot; : []]\n" +
"\n" +
"apiAccessor.getProcessAPI().executeUserTask(taskAssigneeId, taskId, contractInput)\n" +
"</model:from>\n" +
"          <model:to id=\"_WsZR1hszEeqkhYLXtt1BFw\">getDataInput('_WsZR0RszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:intermediateCatchEvent id=\"_RLlAnXH_Eei9Z4IY4QeFuA\" name=\"validateLoanThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-validateLoanThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % validateLoanMaxTime) + validateLoanMinTime)</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:serviceTask id=\"_RLlApXH_Eei9Z4IY4QeFuA\" name=\"Validate Loan\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_WsupABszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WsupARszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WsupAxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WsupAhszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WsupARszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WsupBBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WsupAxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WsupARszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WsupBRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">\n" +
"import org.bonitasoft.engine.bpm.flownode.ActivityInstance\n" +
"import org.bonitasoft.engine.bpm.flownode.UserTaskInstance\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"\n" +
"\n" +
"List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)\n" +
"\n" +
"// Do not change Task assignee to perform the task\n" +
"\n" +
"def UserTaskInstance task = tasks.get(0) \n" +
"def taskId = task.id\n" +
"def assigneeId = task.getAssigneeId()\n" +
"\n" +
"def contractInput = [&quot;documentValidation&quot; : [&quot;allDocumentProvided&quot; : true, &quot;councellorValidation&quot;: true]]\n" +
"\n" +
"apiAccessor.getProcessAPI().executeUserTask(assigneeId, taskId, contractInput)</model:from>\n" +
"          <model:to id=\"_WsupBhszEeqkhYLXtt1BFw\">getDataInput('_WsupARszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:exclusiveGateway id=\"_RLlAuHH_Eei9Z4IY4QeFuA\" name=\"Gateway1\" default=\"_RLllKHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:callActivity id=\"_RLlAvXH_Eei9Z4IY4QeFuA\" name=\"notify credit history\" calledElement=\"_RLlAI3H_Eei9Z4IY4QeFuA\">\n" +
"      <model:ioSpecification id=\"_Wsv3IxszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_Wsv3JBszEeqkhYLXtt1BFw\" itemSubjectRef=\"_bsWT8DqzEem5wKdzfklCCw\"/>\n" +
"        <model:inputSet id=\"_Wsv3JRszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_Wsv3JBszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation id=\"_WsvQERszEeqkhYLXtt1BFw\">\n" +
"        <model:assignment>\n" +
"          <model:from id=\"_WsvQEhszEeqkhYLXtt1BFw\">fakeData</model:from>\n" +
"          <model:to id=\"_Wsv3IBszEeqkhYLXtt1BFw\">aPieceOfData</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"      <model:dataInputAssociation id=\"_Wsv3JhszEeqkhYLXtt1BFw\">\n" +
"        <model:targetRef>_Wsv3JBszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_Wsv3KBszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.util.Map\">[\n" +
"\t&quot;requestId&quot; : String.valueOf(loanDAO.findByCaseId(String.valueOf(processInstanceToAutomate), 0, 1).get(0).caseId),\n" +
"\t&quot;equifaxBeacon&quot; : &quot;10&quot;,\n" +
"\t&quot;transunionFico&quot; : &quot;12&quot;,\n" +
"\t&quot;experianFair&quot; : &quot;9&quot;\n" +
"]</model:from>\n" +
"          <model:to xsi:type=\"model:tFormalExpression\" id=\"_Wsv3JxszEeqkhYLXtt1BFw\">_Wsv3JBszEeqkhYLXtt1BFw</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"      <model:dataOutputAssociation id=\"_Wsv3IRszEeqkhYLXtt1BFw\"/>\n" +
"    </model:callActivity>\n" +
"    <model:dataObject id=\"DataObject_Wsv3IhszEeqkhYLXtt1BFw_bsWT8DqzEem5wKdzfklCCw\" name=\"fakeData\" isCollection=\"false\" itemSubjectRef=\"_bsWT8DqzEem5wKdzfklCCw\"/>\n" +
"    <model:intermediateCatchEvent id=\"_RLlAyXH_Eei9Z4IY4QeFuA\" name=\"reviewCreditHistoryThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-reviewCreditHistoryThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % reviewHistoryMaxTime) + reviewHistoryMinTime)</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:serviceTask id=\"_RLlA0XH_Eei9Z4IY4QeFuA\" name=\"Review Customer Credit History\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_WtFOUBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WtFOURszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WtFOUxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WtFOUhszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WtFOURszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WtFOVBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WtFOUxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WtFOURszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WtFOVRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">\n" +
"import org.bonitasoft.engine.bpm.flownode.ActivityInstance\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"\n" +
"\n" +
"List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)\n" +
"\n" +
"// Walter Bates perform the task\n" +
"def taskId = tasks.get(0).id\n" +
"def walterBatesId = 4L\n" +
"def contractInput = [&quot;committeeReview&quot; : [&quot;valid&quot; : true]]\n" +
"apiAccessor.getProcessAPI().assignUserTaskIfNotAssigned(taskId, walterBatesId);\n" +
"apiAccessor.getProcessAPI().executeUserTask(walterBatesId, taskId, contractInput)</model:from>\n" +
"          <model:to id=\"_WtFOVhszEeqkhYLXtt1BFw\">getDataInput('_WtFOURszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:exclusiveGateway id=\"_RLlA5HH_Eei9Z4IY4QeFuA\" name=\"Gateway2\"/>\n" +
"    <model:intermediateCatchEvent id=\"_RLlA6XH_Eei9Z4IY4QeFuA\" name=\"writeContractThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-writeContractThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % writeContractMaxTime) + writeContractMinTime)</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:serviceTask id=\"_RLlA8XH_Eei9Z4IY4QeFuA\" name=\"Write Contract\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_WtalgBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WtalgRszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WtalgxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WtalghszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WtalgRszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WtalhBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WtalgxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WtalgRszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WtalhRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">\n" +
"import org.bonitasoft.engine.bpm.flownode.ActivityInstance\n" +
"import org.bonitasoft.engine.bpm.flownode.UserTaskInstance\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"\n" +
"\n" +
"List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)\n" +
"\n" +
"// Do not change Task assignee to perform the task\n" +
"\n" +
"def UserTaskInstance task = tasks.get(0)\n" +
"def taskId = task.id\n" +
"def assigneeId = task.getAssigneeId()\n" +
"\n" +
"def contractInput = [&quot;loanRequestedInput&quot; : [&quot;rate&quot; : 3, &quot;durationInMonth&quot; : 18]]\n" +
"apiAccessor.getProcessAPI().executeUserTask(assigneeId, taskId, contractInput)</model:from>\n" +
"          <model:to id=\"_WtalhhszEeqkhYLXtt1BFw\">getDataInput('_WtalgRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:intermediateCatchEvent id=\"_RLlBBHH_Eei9Z4IY4QeFuA\" name=\"signContractThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-signContractThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % signContractMaxTime) + signContractMinTime)</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:serviceTask id=\"_RLlBDHH_Eei9Z4IY4QeFuA\" name=\"Validate Contract\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_Wt2qYBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_Wt2qYRszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_Wt2qYxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_Wt2qYhszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_Wt2qYRszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_Wt2qZBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_Wt2qYxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_Wt2qYRszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_Wt2qZRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">\n" +
"import org.bonitasoft.engine.bpm.flownode.ActivityInstance\n" +
"import org.bonitasoft.engine.bpm.flownode.UserTaskInstance\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"\n" +
"\n" +
"List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)\n" +
"\n" +
"// Do not change Task assignee to perform the task\n" +
"\n" +
"def UserTaskInstance task = tasks.get(0)\n" +
"def taskId = task.id\n" +
"def assigneeId = task.getAssigneeId()\n" +
"\n" +
"def contractInput = [&quot;loanRequestedInput&quot; : [&quot;status&quot; : &quot;Loan Approved&quot;]]\n" +
"apiAccessor.getProcessAPI().executeUserTask(assigneeId, taskId, contractInput)</model:from>\n" +
"          <model:to id=\"_Wt2qZhszEeqkhYLXtt1BFw\">getDataInput('_Wt2qYRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:intermediateCatchEvent id=\"_RLlBH3H_Eei9Z4IY4QeFuA\" name=\"notifyCreditHistoryThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-notifyCreditHistoryThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % notifyCreditMaxTime) + notifyCreditMinTime)</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:serviceTask id=\"_RLlBJ3H_Eei9Z4IY4QeFuA\" name=\"SignContract\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy-script\">\n" +
"      <model:ioSpecification id=\"_WuLagBszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_WuLagRszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_WuLagxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_WuLaghszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_WuLagRszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_WuLahBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_WuLagxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_WuLagRszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_WuLahRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">\n" +
"import org.bonitasoft.engine.bpm.flownode.ActivityInstance\n" +
"import org.bonitasoft.engine.search.SearchOptions\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"\n" +
"\n" +
"List&lt;ActivityInstance> tasks = apiAccessor.getProcessAPI().getActivities(processInstanceToAutomate, 0, 1)\n" +
"\n" +
"// Walter Bates perform the task\n" +
"def taskId = tasks.get(0).id\n" +
"def initiator = BonitaUsers.getProcessInstanceInitiator(apiAccessor, processInstanceToAutomate).getId()\n" +
"def contractInput = [&quot;loanRequestedInput&quot; : [&quot;signature&quot; : &quot;written by Nicolas Chabanoles&quot;]]\n" +
"apiAccessor.getProcessAPI().assignUserTaskIfNotAssigned(taskId, initiator);\n" +
"apiAccessor.getProcessAPI().executeUserTask(initiator, taskId, contractInput)</model:from>\n" +
"          <model:to id=\"_WuLahhszEeqkhYLXtt1BFw\">getDataInput('_WuLagRszEeqkhYLXtt1BFw')/bonitaConnector:fakeScriptExpression</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"    </model:serviceTask>\n" +
"    <model:intermediateCatchEvent id=\"_RLllAnH_Eei9Z4IY4QeFuA\" name=\"validateContractThinkTime\">\n" +
"      <model:timerEventDefinition id=\"eventdef-validateContractThinkTime\">\n" +
"        <model:timeCycle>Long.valueOf(Math.abs(new Random().nextInt() % validateContractMaxTime) + validateContractMinTime)</model:timeCycle>\n" +
"      </model:timerEventDefinition>\n" +
"    </model:intermediateCatchEvent>\n" +
"    <model:sequenceFlow id=\"_RLllHHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAY3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAbXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllH3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAgnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAinH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllInH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAY3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAgnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllJXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAnXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlApXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllKHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAuHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAnXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllK3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAvXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAyXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllLnH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAyXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlA0XH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllMXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlA0XH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlA5HH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllNHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlA5HH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlA6XH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllN3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlA6XH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlA8XH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllOnH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlA8XH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlBBHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllPXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlBBHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlBJ3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllQHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlBDHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAaHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllQ3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAuHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlBH3H_Eei9Z4IY4QeFuA\">\n" +
"      <model:conditionExpression xsi:type=\"model:tFormalExpression\" id=\"_WuMBkBszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Boolean\" language=\"http://www.w3.org/1999/XPath\">amountRequested >= 100000</model:conditionExpression>\n" +
"    </model:sequenceFlow>\n" +
"    <model:sequenceFlow id=\"_RLllR3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlBH3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAvXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllSnH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlBJ3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLllAnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllTXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLllAnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlBDHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllUHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlAinH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlAuHH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLllU3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlApXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlA5HH_Eei9Z4IY4QeFuA\"/>\n" +
"  </model:process>\n" +
"  <model:itemDefinition id=\"_RLllDHH_Eei9Z4IY4QeFuA\" structureRef=\"java:java.lang.Long\"/>\n" +
"  <model:itemDefinition id=\"_RLllEHH_Eei9Z4IY4QeFuA\" structureRef=\"java:java.lang.Integer\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:itemDefinition id=\"_bsWT8DqzEem5wKdzfklCCw\" structureRef=\"java:java.util.Map\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorInput\" structureRef=\"bonitaConnector:scripting-groovy-scriptInputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageInput\" itemRef=\"scripting-groovy-scriptConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovy-scriptConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovy-scriptOutputType\"/>\n" +
"  <model:message id=\"scripting-groovy-scriptConnectorMessageOutput\" itemRef=\"scripting-groovy-scriptConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy-script_Bonita_Connector_Interface\" name=\"scripting-groovy-script_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy-script\" name=\"Execscripting-groovy-script\">\n" +
"      <model:inMessageRef>scripting-groovy-scriptConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovy-scriptConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <model:process id=\"_RLllnXH_Eei9Z4IY4QeFuA\" name=\"deleteLoanRequest\">\n" +
"    <model:ioSpecification id=\"_WuNPsRszEeqkhYLXtt1BFw\">\n" +
"      <model:dataInput id=\"_WuNPshszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLlly3H_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WuNPuBszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLllzXH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:inputSet id=\"_WuNPsxszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuNPshszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WuNPuRszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuNPuBszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:outputSet id=\"_WuNPvRszEeqkhYLXtt1BFw\"/>\n" +
"    </model:ioSpecification>\n" +
"    <model:dataObject id=\"DataObject_WuNPsBszEeqkhYLXtt1BFw_RLlly3H_Eei9Z4IY4QeFuA\" name=\"loanRequestToDelete\" isCollection=\"false\" itemSubjectRef=\"_RLlly3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WuNPtxszEeqkhYLXtt1BFw_RLllzXH_Eei9Z4IY4QeFuA\" name=\"loanPersistenceId\" isCollection=\"false\" itemSubjectRef=\"_RLllzXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:serviceTask id=\"_RLllnnH_Eei9Z4IY4QeFuA\" name=\"delete loanRequest\"/>\n" +
"    <model:endEvent id=\"_RLllrXH_Eei9Z4IY4QeFuA\" name=\"Deletion complete\"/>\n" +
"    <model:serviceTask id=\"_RLllsnH_Eei9Z4IY4QeFuA\" name=\"findLoanRequest\"/>\n" +
"    <model:startEvent id=\"_RLllxHH_Eei9Z4IY4QeFuA\" name=\"Start Deletion\"/>\n" +
"    <model:sequenceFlow id=\"_RLll2XH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLllsnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLllnnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLll3HH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLllnnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLllrXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLll33H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLllxHH_Eei9Z4IY4QeFuA\" targetRef=\"_RLllsnH_Eei9Z4IY4QeFuA\"/>\n" +
"  </model:process>\n" +
"  <model:itemDefinition id=\"_RLlly3H_Eei9Z4IY4QeFuA\" structureRef=\"java:com.company.model.Loan\"/>\n" +
"  <model:itemDefinition id=\"_RLllzXH_Eei9Z4IY4QeFuA\" structureRef=\"java:java.lang.Long\"/>\n" +
"  <model:process id=\"_RLlmBXH_Eei9Z4IY4QeFuA\" name=\"updateLoanCaseId\">\n" +
"    <model:ioSpecification id=\"_WuOd0RszEeqkhYLXtt1BFw\">\n" +
"      <model:dataInput id=\"_WuOd0hszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLlmL3H_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WuOd2BszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLlmMXH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WuOd3hszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLlmNXH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:inputSet id=\"_WuOd0xszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuOd0hszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WuOd2RszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuOd2BszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WuOd3xszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuOd3hszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:outputSet id=\"_WuOd4xszEeqkhYLXtt1BFw\"/>\n" +
"    </model:ioSpecification>\n" +
"    <model:dataObject id=\"DataObject_WuOd0BszEeqkhYLXtt1BFw_RLlmL3H_Eei9Z4IY4QeFuA\" name=\"loanRequestToUpdate\" isCollection=\"false\" itemSubjectRef=\"_RLlmL3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WuOd1xszEeqkhYLXtt1BFw_RLlmMXH_Eei9Z4IY4QeFuA\" name=\"caseId\" isCollection=\"false\" itemSubjectRef=\"_RLlmMXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WuOd3RszEeqkhYLXtt1BFw_RLlmNXH_Eei9Z4IY4QeFuA\" name=\"loanRequestId\" isCollection=\"false\" itemSubjectRef=\"_RLlmNXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:startEvent id=\"_RLlmBnH_Eei9Z4IY4QeFuA\" name=\"Start Update\"/>\n" +
"    <model:serviceTask id=\"_RLlmC3H_Eei9Z4IY4QeFuA\" name=\"update Loan Request\"/>\n" +
"    <model:serviceTask id=\"_RLlmG3H_Eei9Z4IY4QeFuA\" name=\"find Loan Request\"/>\n" +
"    <model:sequenceFlow id=\"_RLlmQXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlmBnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlmG3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLlmRHH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlmG3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLlmC3H_Eei9Z4IY4QeFuA\"/>\n" +
"  </model:process>\n" +
"  <model:itemDefinition id=\"_RLlmL3H_Eei9Z4IY4QeFuA\" structureRef=\"java:com.company.model.Loan\"/>\n" +
"  <model:itemDefinition id=\"_RLlmMXH_Eei9Z4IY4QeFuA\" structureRef=\"java:java.lang.String\"/>\n" +
"  <model:itemDefinition id=\"_RLlmNXH_Eei9Z4IY4QeFuA\" structureRef=\"java:java.lang.Long\"/>\n" +
"  <model:process id=\"_RLlmbHH_Eei9Z4IY4QeFuA\" name=\"generateLoanRequestsBot\">\n" +
"    <model:ioSpecification id=\"_WuPr8RszEeqkhYLXtt1BFw\">\n" +
"      <model:dataInput id=\"_WuPr8hszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLlmmXH_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:dataInput id=\"_WuPr-BszEeqkhYLXtt1BFw\" itemSubjectRef=\"_RLlmm3H_Eei9Z4IY4QeFuA\"/>\n" +
"      <model:inputSet id=\"_WuPr8xszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuPr8hszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:inputSet id=\"_WuPr-RszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInputRefs>_WuPr-BszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"      </model:inputSet>\n" +
"      <model:outputSet id=\"_WuPr_RszEeqkhYLXtt1BFw\"/>\n" +
"    </model:ioSpecification>\n" +
"    <model:dataObject id=\"DataObject_WuPr8BszEeqkhYLXtt1BFw_RLlmmXH_Eei9Z4IY4QeFuA\" name=\"requestsToCreate\" isCollection=\"false\" itemSubjectRef=\"_RLlmmXH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:dataObject id=\"DataObject_WuPr9xszEeqkhYLXtt1BFw_RLlmm3H_Eei9Z4IY4QeFuA\" name=\"numberOfRequestToCreate\" isCollection=\"false\" itemSubjectRef=\"_RLlmm3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:startEvent id=\"_RLlmbXH_Eei9Z4IY4QeFuA\" name=\"Start generation\"/>\n" +
"    <model:serviceTask id=\"_RLlmcnH_Eei9Z4IY4QeFuA\" name=\"generate random data\"/>\n" +
"    <model:endEvent id=\"_RLlmgnH_Eei9Z4IY4QeFuA\" name=\"End generation\">\n" +
"      <model:terminateEventDefinition id=\"_WuPsABszEeqkhYLXtt1BFw\"/>\n" +
"    </model:endEvent>\n" +
"    <model:serviceTask id=\"_RLlmh3H_Eei9Z4IY4QeFuA\" name=\"Request Loan\" implementation=\"BonitaConnector\" operationRef=\"Execscripting-groovy\">\n" +
"      <model:ioSpecification id=\"_Wuj1ABszEeqkhYLXtt1BFw\">\n" +
"        <model:dataInput id=\"_Wuj1ARszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovyConnectorInput\"/>\n" +
"        <model:dataOutput id=\"_Wuj1AxszEeqkhYLXtt1BFw\" itemSubjectRef=\"scripting-groovyConnectorOutput\"/>\n" +
"        <model:inputSet id=\"_Wuj1AhszEeqkhYLXtt1BFw\">\n" +
"          <model:dataInputRefs>_Wuj1ARszEeqkhYLXtt1BFw</model:dataInputRefs>\n" +
"        </model:inputSet>\n" +
"        <model:outputSet id=\"_Wuj1BBszEeqkhYLXtt1BFw\">\n" +
"          <model:dataOutputRefs>_Wuj1AxszEeqkhYLXtt1BFw</model:dataOutputRefs>\n" +
"        </model:outputSet>\n" +
"      </model:ioSpecification>\n" +
"      <model:dataInputAssociation>\n" +
"        <model:targetRef>_Wuj1ARszEeqkhYLXtt1BFw</model:targetRef>\n" +
"        <model:assignment>\n" +
"          <model:from xsi:type=\"model:tFormalExpression\" id=\"_Wuj1BRszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Object\">import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfo\n" +
"import org.bonitasoft.engine.bpm.process.ProcessDeploymentInfoSearchDescriptor\n" +
"import org.bonitasoft.engine.identity.UserCriterion\n" +
"import org.bonitasoft.engine.search.SearchOptionsBuilder\n" +
"import org.bonitasoft.engine.search.SearchResult\n" +
"\n" +
"def searchBuilder = new SearchOptionsBuilder(0, 1);\n" +
"searchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.NAME, &quot;RequestLoan&quot;);\n" +
"searchBuilder.filter(ProcessDeploymentInfoSearchDescriptor.ACTIVATION_STATE, &quot;ENABLED&quot;);\n" +
"SearchResult result = apiAccessor.getProcessAPI().searchProcessDeploymentInfos(searchBuilder.done());\n" +
"ProcessDeploymentInfo requestLoanProcess = (ProcessDeploymentInfo)(result.getResult().get(0));\n" +
"\n" +
"\n" +
"def userInitiator = apiAccessor.getIdentityAPI().getUsers(0, 50, UserCriterion.USER_NAME_ASC).collect { it.id }\n" +
"// userInitiator = [21L,10L,14L,2L]\n" +
"def randomInitiator = new Random()\n" +
"def idInitiator = userInitiator[randomInitiator.nextInt(userInitiator.size())]\n" +
"\n" +
"apiAccessor.getProcessAPI().startProcessWithInputs(idInitiator, requestLoanProcess.getProcessId(), [&quot;loanRequestedInput&quot; : multiInstanceIterator])\n" +
"</model:from>\n" +
"          <model:to id=\"_Wuj1BhszEeqkhYLXtt1BFw\">getDataInput('_Wuj1ARszEeqkhYLXtt1BFw')/bonitaConnector:script</model:to>\n" +
"        </model:assignment>\n" +
"      </model:dataInputAssociation>\n" +
"      <model:multiInstanceLoopCharacteristics id=\"_WuPsBBszEeqkhYLXtt1BFw\" isSequential=\"false\">\n" +
"        <model:loopCardinality xsi:type=\"model:tFormalExpression\" id=\"_WuPsAxszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Integer\" language=\"http://www.w3.org/1999/XPath\"></model:loopCardinality>\n" +
"        <model:completionCondition xsi:type=\"model:tFormalExpression\" id=\"_WuPsAhszEeqkhYLXtt1BFw\" evaluatesToTypeRef=\"java:java.lang.Boolean\" language=\"http://www.w3.org/1999/XPath\"></model:completionCondition>\n" +
"      </model:multiInstanceLoopCharacteristics>\n" +
"    </model:serviceTask>\n" +
"    <model:sequenceFlow id=\"_RLlmp3H_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlmbXH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlmcnH_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLlmqnH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlmcnH_Eei9Z4IY4QeFuA\" targetRef=\"_RLlmh3H_Eei9Z4IY4QeFuA\"/>\n" +
"    <model:sequenceFlow id=\"_RLlmrXH_Eei9Z4IY4QeFuA\" name=\"\" sourceRef=\"_RLlmh3H_Eei9Z4IY4QeFuA\" targetRef=\"_RLlmgnH_Eei9Z4IY4QeFuA\"/>\n" +
"  </model:process>\n" +
"  <model:itemDefinition id=\"_RLlmmXH_Eei9Z4IY4QeFuA\" structureRef=\"java:java.util.List\"/>\n" +
"  <model:itemDefinition id=\"_RLlmm3H_Eei9Z4IY4QeFuA\" structureRef=\"java:java.lang.Integer\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovyConnectorInput\" structureRef=\"bonitaConnector:scripting-groovyInputType\"/>\n" +
"  <model:message id=\"scripting-groovyConnectorMessageInput\" itemRef=\"scripting-groovyConnectorInput\"/>\n" +
"  <model:itemDefinition id=\"scripting-groovyConnectorOutput\" structureRef=\"bonitaConnector:scripting-groovyOutputType\"/>\n" +
"  <model:message id=\"scripting-groovyConnectorMessageOutput\" itemRef=\"scripting-groovyConnectorOutput\"/>\n" +
"  <model:interface id=\"scripting-groovy_Bonita_Connector_Interface\" name=\"scripting-groovy_Bonita_Connector_Interface\">\n" +
"    <model:operation id=\"Execscripting-groovy\" name=\"Execscripting-groovy\">\n" +
"      <model:inMessageRef>scripting-groovyConnectorMessageInput</model:inMessageRef>\n" +
"      <model:outMessageRef>scripting-groovyConnectorMessageOutput</model:outMessageRef>\n" +
"    </model:operation>\n" +
"  </model:interface>\n" +
"  <di:BPMNDiagram name=\"LoanManagement\">\n" +
"    <di:BPMNPlane id=\"plane__RLk98HH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk98HH_Eei9Z4IY4QeFuA\">\n" +
"      <di:BPMNShape id=\"_RLlm4XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_WrR3gBszEeqkhYLXtt1BFw\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"1017.0\" width=\"1748.0\" x=\"0.0\" y=\"0.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm5HH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk98nH_Eei9Z4IY4QeFuA\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"437.0\" width=\"1718.0\" x=\"30.0\" y=\"0.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm6nH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk983H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"90.0\" y=\"68.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrSenxszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"103.0\" x=\"54.0\" y=\"103.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm53H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk9-HH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"303.0\" y=\"244.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm7nH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-IHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"1177.0\" y=\"95.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm8HH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-Q3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"1197.0\" y=\"130.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrTFohszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"140.0\" x=\"1221.0\" y=\"165.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm9XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-TXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"341.0\" y=\"61.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrTFoxszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"126.0\" x=\"364.0\" y=\"131.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm-XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-UnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"913.0\" y=\"68.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrTssBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"148.0\" x=\"854.0\" y=\"103.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlm_XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-V3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"683.0\" y=\"53.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnAHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-ZnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"188.0\" y=\"63.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnA3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-h3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"1167.0\" y=\"228.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnBnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-lnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"1212.0\" y=\"342.0\"/>\n" +
"        <di:BPMNLabel id=\"_Wrpq8xszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"133.0\" x=\"1161.0\" y=\"377.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnD3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-n3H_Eei9Z4IY4QeFuA\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"250.0\" width=\"1718.0\" x=\"30.0\" y=\"437.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnEnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-oHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"460.0\" y=\"494.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnFXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk-z3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"70.0\" width=\"140.0\" x=\"1063.0\" y=\"489.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnGHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_AXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"674.0\" y=\"494.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrqSAhszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"170.0\" x=\"610.0\" y=\"542.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnHHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_BnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"1276.0\" y=\"499.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnH3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_MXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"1405.0\" y=\"499.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnInH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_O3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"1557.0\" y=\"509.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrqSBhszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"170.0\" x=\"1487.0\" y=\"544.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnJnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_QHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"323.0\" y=\"516.0\"/>\n" +
"        <di:BPMNLabel id=\"_WrqSBxszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"259.0\" x=\"216.0\" y=\"496.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnKnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_RXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"987.0\" y=\"502.0\"/>\n" +
"        <di:BPMNLabel id=\"_Wrq5EBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"126.0\" x=\"946.0\" y=\"470.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnM3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_TnH_Eei9Z4IY4QeFuA\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"330.0\" width=\"1718.0\" x=\"30.0\" y=\"687.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnNnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_T3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"876.0\" y=\"892.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnOXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_dXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"503.0\" y=\"887.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnPHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_hHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"728.0\" y=\"907.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsA3URszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"170.0\" x=\"669.0\" y=\"879.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnQHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_iXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"906.0\" y=\"768.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsA3UhszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"163.0\" x=\"1004.0\" y=\"736.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNEdge id=\"_RLln6XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_pXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"580.0\" y=\"519.0\"/>\n" +
"        <di_1:waypoint x=\"674.0\" y=\"519.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLln7nH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_qHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"717.0\" y=\"501.0\"/>\n" +
"        <di_1:waypoint x=\"854.0\" y=\"501.0\"/>\n" +
"        <di_1:waypoint x=\"854.0\" y=\"520.0\"/>\n" +
"        <di_1:waypoint x=\"987.0\" y=\"520.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLln9HH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_rHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1126.0\" y=\"489.0\"/>\n" +
"        <di_1:waypoint x=\"1126.0\" y=\"114.0\"/>\n" +
"        <di_1:waypoint x=\"1177.0\" y=\"114.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLln-XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_r3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"288.0\" y=\"82.0\"/>\n" +
"        <di_1:waypoint x=\"341.0\" y=\"82.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLln_nH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_snH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"120.0\" y=\"79.0\"/>\n" +
"        <di_1:waypoint x=\"188.0\" y=\"79.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloBXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_tXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"362.0\" y=\"104.0\"/>\n" +
"        <di_1:waypoint x=\"362.0\" y=\"244.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloCnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_uXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"384.0\" y=\"82.0\"/>\n" +
"        <di_1:waypoint x=\"683.0\" y=\"82.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloD3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_vHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"803.0\" y=\"84.0\"/>\n" +
"        <di_1:waypoint x=\"913.0\" y=\"84.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloFHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_v3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"314.0\" y=\"304.0\"/>\n" +
"        <di_1:waypoint x=\"314.0\" y=\"419.0\"/>\n" +
"        <di_1:waypoint x=\"338.0\" y=\"419.0\"/>\n" +
"        <di_1:waypoint x=\"338.0\" y=\"516.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloG3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_wnH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"684.0\" y=\"494.0\"/>\n" +
"        <di_1:waypoint x=\"684.0\" y=\"113.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloIXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_xXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1277.0\" y=\"105.0\"/>\n" +
"        <di_1:waypoint x=\"1352.0\" y=\"105.0\"/>\n" +
"        <di_1:waypoint x=\"1352.0\" y=\"499.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloJnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_yHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1199.0\" y=\"160.0\"/>\n" +
"        <di_1:waypoint x=\"1199.0\" y=\"228.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloK3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_y3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1226.0\" y=\"288.0\"/>\n" +
"        <di_1:waypoint x=\"1226.0\" y=\"342.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloMHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_znH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1376.0\" y=\"524.0\"/>\n" +
"        <di_1:waypoint x=\"1405.0\" y=\"524.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloNXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_0XH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1505.0\" y=\"524.0\"/>\n" +
"        <di_1:waypoint x=\"1557.0\" y=\"524.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloOnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_1HH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"339.0\" y=\"559.0\"/>\n" +
"        <di_1:waypoint x=\"339.0\" y=\"914.0\"/>\n" +
"        <di_1:waypoint x=\"503.0\" y=\"914.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloQHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_2HH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"623.0\" y=\"919.0\"/>\n" +
"        <di_1:waypoint x=\"728.0\" y=\"919.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloRXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_23H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"949.0\" y=\"787.0\"/>\n" +
"        <di_1:waypoint x=\"1006.0\" y=\"787.0\"/>\n" +
"        <di_1:waypoint x=\"1006.0\" y=\"545.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloSnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_33H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"366.0\" y=\"530.0\"/>\n" +
"        <di_1:waypoint x=\"460.0\" y=\"530.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloUHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_4nH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"906.0\" y=\"784.0\"/>\n" +
"        <di_1:waypoint x=\"767.0\" y=\"784.0\"/>\n" +
"        <di_1:waypoint x=\"767.0\" y=\"113.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloVnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_5XH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"900.0\" y=\"892.0\"/>\n" +
"        <di_1:waypoint x=\"900.0\" y=\"849.0\"/>\n" +
"        <di_1:waypoint x=\"917.0\" y=\"849.0\"/>\n" +
"        <di_1:waypoint x=\"917.0\" y=\"811.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloZnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLk_63H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1030.0\" y=\"523.0\"/>\n" +
"        <di_1:waypoint x=\"1063.0\" y=\"523.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_ivfXUHPFEeiw3J4-SJPrKA\" bpmnElement=\"_iveJMHPFEeiw3J4-SJPrKA\">\n" +
"        <di_1:waypoint x=\"758.0\" y=\"919.0\"/>\n" +
"        <di_1:waypoint x=\"876.0\" y=\"919.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNShape id=\"_RLlnTnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_WsCsgBszEeqkhYLXtt1BFw\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"250.0\" width=\"824.0\" x=\"0.0\" y=\"1067.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnUXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAJHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"97.0\" y=\"1168.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsDTkBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"178.0\" x=\"23.0\" y=\"1203.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_zfYu4Ba7EeqF6b6kCtCpmA\" bpmnElement=\"_zfYH0Ba7EeqF6b6kCtCpmA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"720.0\" y=\"1168.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsDTkhszEeqkhYLXtt1BFw\" labelStyle=\"_WsDTkRszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"140.0\" x=\"665.0\" y=\"1203.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNEdge id=\"_RLloYXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAPnH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"127.0\" y=\"1183.0\"/>\n" +
"        <di_1:waypoint x=\"720.0\" y=\"1183.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNShape id=\"_RLlnXnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_WsDTkxszEeqkhYLXtt1BFw\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"622.0\" width=\"2175.0\" x=\"0.0\" y=\"1367.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnYXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAY3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"84.0\" y=\"1427.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsD6rhszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"44.0\" x=\"77.0\" y=\"1462.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnZXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAaHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"1832.0\" y=\"1475.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsD6sBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"29.0\" x=\"1833.0\" y=\"1510.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnaXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAbXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"49.0\" y=\"1550.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnbHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAgnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"178.0\" y=\"1427.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsEhshszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"155.0\" x=\"116.0\" y=\"1462.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlncHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAinH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"260.0\" y=\"1417.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnc3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAnXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"521.0\" y=\"1427.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsZ44BszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"155.0\" x=\"459.0\" y=\"1462.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnd3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlApXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"613.0\" y=\"1417.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnenH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAuHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"426.0\" y=\"1420.0\"/>\n" +
"        <di:BPMNLabel id=\"_WsvQEBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"59.0\" x=\"418.0\" y=\"1468.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnfnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAvXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"398.0\" y=\"1626.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlngXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlAyXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"443.0\" y=\"1740.0\"/>\n" +
"        <di:BPMNLabel id=\"_Wsv3KhszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"207.0\" x=\"355.0\" y=\"1775.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnhXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlA0XH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"398.0\" y=\"1835.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlniHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlA5HH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"43.0\" width=\"43.0\" x=\"792.0\" y=\"1433.0\"/>\n" +
"        <di:BPMNLabel id=\"_WtFOWBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"59.0\" x=\"784.0\" y=\"1481.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnjHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlA6XH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"882.0\" y=\"1427.0\"/>\n" +
"        <di:BPMNLabel id=\"_WtFOWRszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"163.0\" x=\"816.0\" y=\"1462.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnkHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlA8XH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"977.0\" y=\"1417.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnk3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlBBHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"1129.0\" y=\"1417.0\"/>\n" +
"        <di:BPMNLabel id=\"_WtaliBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"155.0\" x=\"1067.0\" y=\"1452.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnl3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlBDHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"1585.0\" y=\"1475.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnmnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlBH3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"443.0\" y=\"1529.0\"/>\n" +
"        <di:BPMNLabel id=\"_Wt2qaBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"207.0\" x=\"355.0\" y=\"1564.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnnnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlBJ3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"1224.0\" y=\"1417.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnoXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllAnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"1376.0\" y=\"1417.0\"/>\n" +
"        <di:BPMNLabel id=\"_WuLaiBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"185.0\" x=\"1299.0\" y=\"1452.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNEdge id=\"_RLloa3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllHHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"102.0\" y=\"1457.0\"/>\n" +
"        <di_1:waypoint x=\"102.0\" y=\"1550.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlocXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllH3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"208.0\" y=\"1442.0\"/>\n" +
"        <di_1:waypoint x=\"260.0\" y=\"1442.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloeHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllInH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"114.0\" y=\"1442.0\"/>\n" +
"        <di_1:waypoint x=\"178.0\" y=\"1442.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlof3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllJXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"551.0\" y=\"1442.0\"/>\n" +
"        <di_1:waypoint x=\"613.0\" y=\"1442.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlohnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllKHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"469.0\" y=\"1441.0\"/>\n" +
"        <di_1:waypoint x=\"521.0\" y=\"1441.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlojXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllK3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"458.0\" y=\"1686.0\"/>\n" +
"        <di_1:waypoint x=\"458.0\" y=\"1740.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlolHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllLnH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"458.0\" y=\"1770.0\"/>\n" +
"        <di_1:waypoint x=\"458.0\" y=\"1835.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlom3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllMXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"518.0\" y=\"1855.0\"/>\n" +
"        <di_1:waypoint x=\"856.0\" y=\"1855.0\"/>\n" +
"        <di_1:waypoint x=\"856.0\" y=\"1805.0\"/>\n" +
"        <di_1:waypoint x=\"816.0\" y=\"1805.0\"/>\n" +
"        <di_1:waypoint x=\"816.0\" y=\"1476.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlooXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllNHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"835.0\" y=\"1448.0\"/>\n" +
"        <di_1:waypoint x=\"882.0\" y=\"1448.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloqHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllN3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"912.0\" y=\"1442.0\"/>\n" +
"        <di_1:waypoint x=\"977.0\" y=\"1442.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlor3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllOnH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1077.0\" y=\"1437.0\"/>\n" +
"        <di_1:waypoint x=\"1129.0\" y=\"1437.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlotnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllPXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1159.0\" y=\"1437.0\"/>\n" +
"        <di_1:waypoint x=\"1224.0\" y=\"1437.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlovXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllQHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1685.0\" y=\"1488.0\"/>\n" +
"        <di_1:waypoint x=\"1832.0\" y=\"1488.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlow3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllQ3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"452.0\" y=\"1463.0\"/>\n" +
"        <di_1:waypoint x=\"452.0\" y=\"1529.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLloynH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllR3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"458.0\" y=\"1559.0\"/>\n" +
"        <di_1:waypoint x=\"458.0\" y=\"1626.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlo0XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllSnH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1324.0\" y=\"1437.0\"/>\n" +
"        <di_1:waypoint x=\"1376.0\" y=\"1437.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlo2HH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllTXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"1406.0\" y=\"1436.0\"/>\n" +
"        <di_1:waypoint x=\"1485.0\" y=\"1436.0\"/>\n" +
"        <di_1:waypoint x=\"1485.0\" y=\"1487.0\"/>\n" +
"        <di_1:waypoint x=\"1585.0\" y=\"1487.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLmMI3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllUHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"360.0\" y=\"1441.0\"/>\n" +
"        <di_1:waypoint x=\"426.0\" y=\"1441.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLmMKnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllU3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"713.0\" y=\"1448.0\"/>\n" +
"        <di_1:waypoint x=\"792.0\" y=\"1448.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNShape id=\"_RLlnwHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_WuMooBszEeqkhYLXtt1BFw\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"250.0\" width=\"0.0\" x=\"0.0\" y=\"2039.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnw3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllnnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"313.0\" y=\"2131.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnxnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllrXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"540.0\" y=\"2131.0\"/>\n" +
"        <di:BPMNLabel id=\"_WuNPvxszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"126.0\" x=\"492.0\" y=\"2166.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnynH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllsnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"122.0\" y=\"2131.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnzXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLllxHH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"39.0\" y=\"2145.0\"/>\n" +
"        <di:BPMNLabel id=\"_WuN2wBszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"103.0\" x=\"3.0\" y=\"2180.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNEdge id=\"_RLlo3nH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLll2XH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"222.0\" y=\"2156.0\"/>\n" +
"        <di_1:waypoint x=\"313.0\" y=\"2156.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLlo43H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLll3HH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"413.0\" y=\"2151.0\"/>\n" +
"        <di_1:waypoint x=\"540.0\" y=\"2151.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLmME3H_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLll33H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"69.0\" y=\"2154.0\"/>\n" +
"        <di_1:waypoint x=\"114.0\" y=\"2154.0\"/>\n" +
"        <di_1:waypoint x=\"114.0\" y=\"2137.0\"/>\n" +
"        <di_1:waypoint x=\"122.0\" y=\"2137.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNShape id=\"_RLln1nH_Eei9Z4IY4QeFuA\" bpmnElement=\"_WuN2wRszEeqkhYLXtt1BFw\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"250.0\" width=\"0.0\" x=\"0.0\" y=\"2339.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLln2XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmBnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"68.0\" y=\"2427.0\"/>\n" +
"        <di:BPMNLabel id=\"_WuOd5BszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"89.0\" x=\"39.0\" y=\"2462.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLln3XH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmC3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"50.0\" width=\"100.0\" x=\"388.0\" y=\"2427.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLln4HH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmG3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"141.0\" y=\"2417.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNEdge id=\"_RLmMGXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmQXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"98.0\" y=\"2444.0\"/>\n" +
"        <di_1:waypoint x=\"141.0\" y=\"2444.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLmMHnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmRHH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"261.0\" y=\"2449.0\"/>\n" +
"        <di_1:waypoint x=\"388.0\" y=\"2449.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNShape id=\"_RLlnqnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_WuPE4BszEeqkhYLXtt1BFw\" isHorizontal=\"true\">\n" +
"        <dc:Bounds height=\"250.0\" width=\"0.0\" x=\"0.0\" y=\"2639.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnrXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmbXH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"65.0\" y=\"2783.0\"/>\n" +
"        <di:BPMNLabel id=\"_WuPr_hszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"118.0\" x=\"21.0\" y=\"2818.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnsXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmcnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"60.0\" width=\"120.0\" x=\"214.0\" y=\"2768.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlntHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmgnH_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"30.0\" width=\"30.0\" x=\"778.0\" y=\"2783.0\"/>\n" +
"        <di:BPMNLabel id=\"_WuPsARszEeqkhYLXtt1BFw\" labelStyle=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"          <dc:Bounds height=\"17.0\" width=\"103.0\" x=\"742.0\" y=\"2818.0\"/>\n" +
"        </di:BPMNLabel>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNShape id=\"_RLlnuHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmh3H_Eei9Z4IY4QeFuA\">\n" +
"        <dc:Bounds height=\"77.0\" width=\"154.0\" x=\"450.0\" y=\"2759.0\"/>\n" +
"      </di:BPMNShape>\n" +
"      <di:BPMNEdge id=\"_RLmMMXH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmp3H_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"95.0\" y=\"2798.0\"/>\n" +
"        <di_1:waypoint x=\"214.0\" y=\"2798.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLmMNnH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmqnH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"334.0\" y=\"2794.0\"/>\n" +
"        <di_1:waypoint x=\"450.0\" y=\"2794.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"      <di:BPMNEdge id=\"_RLmMPHH_Eei9Z4IY4QeFuA\" bpmnElement=\"_RLlmrXH_Eei9Z4IY4QeFuA\">\n" +
"        <di_1:waypoint x=\"604.0\" y=\"2806.0\"/>\n" +
"        <di_1:waypoint x=\"778.0\" y=\"2806.0\"/>\n" +
"        <di:BPMNLabel/>\n" +
"      </di:BPMNEdge>\n" +
"    </di:BPMNPlane>\n" +
"    <di:BPMNLabelStyle id=\"_WrSenhszEeqkhYLXtt1BFw\">\n" +
"      <dc:Font isBold=\"false\" isItalic=\"false\" isStrikeThrough=\"false\" isUnderline=\"false\" name=\"Ubuntu\" size=\"9.0\"/>\n" +
"    </di:BPMNLabelStyle>\n" +
"    <di:BPMNLabelStyle id=\"_WsDTkRszEeqkhYLXtt1BFw\">\n" +
"      <dc:Font isBold=\"false\" isItalic=\"false\" isStrikeThrough=\"false\" isUnderline=\"false\" name=\"Segoe UI\" size=\"9.0\"/>\n" +
"    </di:BPMNLabelStyle>\n" +
"  </di:BPMNDiagram>\n" +
"</model:definitions>";