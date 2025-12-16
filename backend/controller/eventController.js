const Event = require("../model/eventModal");

const createEvent = async (req, res) => {
  try {
    const { title, startDate, endDate, type, eventSession, totalDays } =
      req.body;
    if (!title || !startDate || !type || !eventSession || !totalDays) {
      return res.status(400).json({
        success: false,
        message: "Title, start date & type are required",
      });
    }

    const finalEndDate = endDate ? endDate : startDate;

    if (new Date(finalEndDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    const event = new Event({
      title,
      startDate,
      endDate: finalEndDate,
      type,
      eventSession,
      totalDays,
    });
    console.log(event);
    await event.save();

    res.status(201).json({
      success: true,
      data: event,
      message: "Event created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const { sessionName } = req.params;
    const events = await Event.find({ eventSession: sessionName }).sort({
      date: 1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("获取事件错误:", error);
    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 获取单个事件
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "事件未找到",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("获取事件错误:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "无效的事件ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 更新事件
const updateEvent = async (req, res) => {
  try {
    const { title, date, type } = req.body;

    // 构建更新对象
    const updateData = {};
    if (title) updateData.title = title;
    if (date) updateData.date = new Date(date);
    if (type) updateData.type = type;

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true, // 返回更新后的文档
      runValidators: true, // 运行模式验证器
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "事件未找到",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
      message: "事件更新成功",
    });
  } catch (error) {
    console.error("更新事件错误:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "无效的事件ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 删除事件
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "事件未找到",
      });
    }

    res.status(200).json({
      success: true,
      message: "事件删除成功",
    });
  } catch (error) {
    console.error("删除事件错误:", error);

    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "无效的事件ID",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 按类型查询事件
const getEventsByType = async (req, res) => {
  try {
    const { type } = req.params;

    const events = await Event.find({ type }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("按类型查询事件错误:", error);
    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 按日期范围查询事件
const getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "需要提供开始日期和结束日期",
      });
    }

    const events = await Event.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("按日期范围查询事件错误:", error);
    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 搜索事件
const searchEvents = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "需要提供搜索关键词",
      });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } },
      ],
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("搜索事件错误:", error);
    res.status(500).json({
      success: false,
      message: error.message || "服务器错误",
    });
  }
};

// 导出所有控制器函数
module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getEventsByType,
  getEventsByDateRange,
  searchEvents,
};
