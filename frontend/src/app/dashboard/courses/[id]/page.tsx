"use client";

import React, { useEffect, useState } from "react";
import { courseService } from "../../../api/courseService";
import { Course } from "../../../types/course";
import { userService } from "@/app/api/userService";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { User } from "@/app/types/user";
import ExamsTab from "../../../../components/ExamsTab";
import UsersTab from "../../../../components/UsersTab";
import ExamTemplatesTab from "@/components/ExamTemplatesTab";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const CoursePage = ({ params }: { params: { id: number } }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [profesor, setProfesor] = useState<User | null>(null);
  
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (params.id) {
      courseService.getCourseById(params.id).then((data) => {
        if (data) {
          setCourse(data);
        }
      });
    }
    if (course?.course_manager_id) {
      userService.useGetUserById(course.course_manager_id).then((data) => {
        if (data) {
          setProfesor(data);
        }
      });
    }
    
  }, [params.id, course?.course_manager_id, ]);

  if (!course || !profesor) {
    return <p>Loading course details...</p>;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <h1 className="text-xl ">Profesor : {profesor.name}</h1>
      </div>
      <p className="mt-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid,
        corporis quasi? Dolor eaque tempora exercitationem, incidunt fugiat
        ipsam in veniam explicabo, corporis commodi aliquid inventore
        perferendis iste labore nulla nobis!
      </p>
      <div>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Exams" {...a11yProps(0)} />
            <Tab label="Users" {...a11yProps(1)} />
            <Tab label="Exam Templates" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <ExamsTab courseId={course.id} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <UsersTab courseId={course.id} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <ExamTemplatesTab courseId={course.id} />
        </CustomTabPanel>

      </div>
    </div>
  );
};

export default CoursePage;