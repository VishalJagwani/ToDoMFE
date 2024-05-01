import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input, Tabs, Empty, Alert, Form, Divider } from "antd";
import { isEmpty } from "lodash";
import TodoItems from "./TodoItems";
import TodoTaskType from "../model/TodoTask";
import { checkInput, validator } from "../utils/validatorHelpers";

interface Props {
	defaultData?: TodoTaskType[];
}

interface StatusMapping {
	[key: string]: boolean;
}

const STATUS_MAPPING: StatusMapping = {
	active: false,
	completed: true,
};

const Container = styled.div`
	font-size: 3rem;
	font-family: system-ui;
	margin: auto;
	max-width: 500px;
	margin-top: 20px;
`;

const Wrapper = styled.div`
	margin: 2rem 1rem;
`;

const MainView: React.FC<Props> = ({ defaultData = [] }) => {
	const [form] = Form.useForm();
	const [todos, setTodos] = useState<TodoTaskType[]>([]);
	const [filteredTodos, setFilteredTodos] = useState<TodoTaskType[]>([]);
	const [currentTab, setCurrentTab] = useState("all");
	const [description, setDescription] = useState("");
	const [disableForm, setDisableForm] = useState(false);
	const [error, setError] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);

	const getStoredTodos = (): TodoTaskType[] => JSON.parse(localStorage.getItem("todos") as string) || [];
	const setStoredTodos = (items: TodoTaskType[]) => {
		try {
			localStorage.setItem("todos", JSON.stringify(items));
		} catch (err) {
			setError(`A problem occurred while trying to access localStorage: ${err}`);
		}
	};

	useEffect(() => {
		try {
			const storedTodos: TodoTaskType[] = getStoredTodos();
			setTodos(storedTodos);
		} catch (err) {
			setError(`A problem occurred while trying to access localStorage: ${err}`);
		}
	}, []);

	useEffect(() => {
		setStoredTodos(todos);
		filterData();
	}, [todos.length]);

	useEffect(() => {
		filterData();
	}, [currentTab]);

	const updateItem = (item: TodoTaskType) => {
		const updateIndex = todos.map((todo) => todo.id).indexOf(item.id);
		const updatedTodos = todos;
		updatedTodos[updateIndex] = item;
		setTodos(updatedTodos);
		setStoredTodos(updatedTodos);
		filterData();
	};

	const onClear = () => {
		if (isEmpty(todos)) {
			setTodos(defaultData);
			setStoredTodos(defaultData);
		} else {
			setTodos([]);
			setStoredTodos([]);
		}
	};

	const filterData = () => {
		let result = [];
		if (currentTab !== "all") {
			result = todos.filter((todo) => todo.status === STATUS_MAPPING[currentTab]);
		} else {
			result = todos;
		}
		setFilteredTodos(result);
	};

	const onAdd = async () => {
		setError("");
		try {
			await validator(form.validateFields);
			todos.push({
				id: Math.floor(Math.random() * Date.now()),
				description: description.trim(),
				status: false,
			});
			setStoredTodos(todos);
			setDescription("");
			setShowSuccess(true);
			setDisableForm(true);
			form.resetFields();
			setTimeout(() => {
				setShowSuccess(false);
				setDisableForm(false);
			}, 1500);
		} catch (errorInfo) {
			setError(`Please check the "Description" field warnings`);
		}
	};

	return (
		<Container>
			<Wrapper>
				<Form form={form} name="todo" style={{ width: "100%" }} layout="vertical" disabled={disableForm}>
					<Form.Item
						hasFeedback
						validateFirst
						name="description"
						label="Tasks To-Do"
						rules={[
							{
								required: true,
								validator: checkInput,
							},
						]}
					>
						<Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
					</Form.Item>
					<Form.Item>
						<Button type="primary" onClick={() => onAdd()} data-testid="add-btn">
							Add Task
						</Button>
					</Form.Item>
				</Form>
				{!isEmpty(error) && <Alert message={error} type="error" />}
				{showSuccess && <Alert message={"Task added successfully!"} type="success" />}
				<Divider style={{ marginBottom: "20px" }} />
				<Tabs
					tabBarExtraContent={{
						right: (
							<Button style={{ marginRight: "10px" }} onClick={() => onClear()} data-testid="clear-btn">
								{isEmpty(todos) ? "Add mock data" : "Clear all"}
							</Button>
						),
					}}
					items={["All", "Active", "Completed"].map((tab) => ({
						label: tab,
						key: tab.toLowerCase(),
					}))}
					onChange={(e) => setCurrentTab(e)}
				/>
				{isEmpty(filteredTodos) ? (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
				) : (
					<TodoItems items={filteredTodos} updateItem={updateItem} />
				)}
			</Wrapper>
		</Container>
	);
};

export default MainView;
