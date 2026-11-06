
import 'package:flutter/material.dart';

class TeacherAttendancePage extends StatefulWidget {
  const TeacherAttendancePage({super.key});

  @override
  State<TeacherAttendancePage> createState() =>
      _TeacherAttendancePageState();
}

class _TeacherAttendancePageState
    extends State<TeacherAttendancePage> {
  static const Color primaryColor = Color(0xFF2563EB);

  final List<Map<String, dynamic>> students = [
    {
      'name': 'Nguyễn Minh Anh',
      'class': 'Lớp 3A',
      'status': true,
    },
    {
      'name': 'Trần Gia Bảo',
      'class': 'Lớp 3A',
      'status': true,
    },
    {
      'name': 'Lê Hoàng Nam',
      'class': 'Lớp 2B',
      'status': false,
    },
    {
      'name': 'Phạm Ngọc Hà',
      'class': 'Lớp 2B',
      'status': false,
    },
  ];

  int get completedCount =>
      students.where((student) => student['status'] == true).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Điểm danh học sinh',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSummary(),
          const SizedBox(height: 18),

          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: _openFaceRecognition,
              icon: const Icon(Icons.face),
              label: const Text('Bắt đầu nhận diện khuôn mặt'),
              style: ElevatedButton.styleFrom(
                backgroundColor: primaryColor,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),

          const SizedBox(height: 22),

          const Text(
            'Danh sách học sinh',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),

          const SizedBox(height: 12),

          ...students.asMap().entries.map(
            (entry) => _buildStudentCard(
              entry.key,
              entry.value,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummary() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'ĐÓN HỌC SINH BUỔI SÁNG',
            style: TextStyle(color: Colors.white70),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: _summaryItem(
                  '$completedCount',
                  'Đã lên xe',
                ),
              ),
              Expanded(
                child: _summaryItem(
                  '${students.length - completedCount}',
                  'Chưa điểm danh',
                ),
              ),
              Expanded(
                child: _summaryItem(
                  '${students.length}',
                  'Tổng số',
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(
              value: students.isEmpty
                  ? 0
                  : completedCount / students.length,
              minHeight: 8,
              backgroundColor: Colors.white30,
              valueColor: const AlwaysStoppedAnimation(Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _summaryItem(String value, String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  Widget _buildStudentCard(
    int index,
    Map<String, dynamic> student,
  ) {
    final bool completed = student['status'] as bool;

    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade50,
          child: Text(
            student['name'].toString().substring(0, 1),
            style: const TextStyle(
              color: primaryColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          student['name'],
          style: const TextStyle(fontWeight: FontWeight.w600),
        ),
        subtitle: Text(student['class']),
        trailing: completed
            ? const Icon(
                Icons.check_circle,
                color: Colors.green,
              )
            : TextButton(
                onPressed: () => _markAttendance(index),
                child: const Text('Điểm danh'),
              ),
      ),
    );
  }

  void _markAttendance(int index) {
    setState(() {
      students[index]['status'] = true;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Đã cập nhật điểm danh mẫu'),
      ),
    );
  }

  void _openFaceRecognition() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Chức năng nhận diện khuôn mặt sẽ được tích hợp ở bước AI.',
        ),
      ),
    );
  }
}
