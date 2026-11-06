
import 'package:flutter/material.dart';

class TeacherRoutePage extends StatelessWidget {
  const TeacherRoutePage({super.key});

  static const Color primaryColor = Color(0xFF2563EB);

  @override
  Widget build(BuildContext context) {
    final stops = [
      {
        'name': 'Trường Tiểu học ABC',
        'address': 'Điểm xuất phát',
        'time': '06:30',
        'completed': true,
      },
      {
        'name': 'Điểm đón số 1',
        'address': 'Khu dân cư An Hải',
        'time': '06:45',
        'completed': true,
      },
      {
        'name': 'Điểm đón số 2',
        'address': 'Đường Nguyễn Văn Linh',
        'time': '07:00',
        'completed': false,
      },
      {
        'name': 'Điểm đón số 3',
        'address': 'Khu đô thị FPT',
        'time': '07:15',
        'completed': false,
      },
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Lộ trình xe',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildRouteSummary(),
          const SizedBox(height: 18),
          _buildMapPlaceholder(),
          const SizedBox(height: 22),

          const Text(
            'Danh sách điểm dừng',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),

          ...List.generate(
            stops.length,
            (index) => _buildStopCard(
              index: index,
              name: stops[index]['name'] as String,
              address: stops[index]['address'] as String,
              time: stops[index]['time'] as String,
              completed: stops[index]['completed'] as bool,
              isLast: index == stops.length - 1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRouteSummary() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: primaryColor,
        borderRadius: BorderRadius.circular(18),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'TUYẾN 05',
            style: TextStyle(
              color: Colors.white70,
              fontSize: 13,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Đón học sinh buổi sáng',
            style: TextStyle(
              color: Colors.white,
              fontSize: 19,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 16),
          Row(
            children: [
              Icon(Icons.directions_bus, color: Colors.white),
              SizedBox(width: 8),
              Text(
                '43B-123.45',
                style: TextStyle(color: Colors.white),
              ),
              Spacer(),
              Icon(Icons.access_time, color: Colors.white),
              SizedBox(width: 5),
              Text(
                '06:30 - 07:30',
                style: TextStyle(color: Colors.white),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMapPlaceholder() {
    return Container(
      height: 190,
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.blue.shade100),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(
            Icons.map_outlined,
            size: 55,
            color: primaryColor,
          ),
          const SizedBox(height: 10),
          const Text(
            'Bản đồ lộ trình xe',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 5),
          Text(
            'Sẽ tích hợp bản đồ và GPS',
            style: TextStyle(
              color: Colors.grey.shade600,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStopCard({
    required int index,
    required String name,
    required String address,
    required String time,
    required bool completed,
    required bool isLast,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          SizedBox(
            width: 42,
            child: Column(
              children: [
                CircleAvatar(
                  radius: 15,
                  backgroundColor:
                      completed ? Colors.green : Colors.blue.shade100,
                  child: completed
                      ? const Icon(
                          Icons.check,
                          color: Colors.white,
                          size: 18,
                        )
                      : Text(
                          '${index + 1}',
                          style: const TextStyle(
                            color: primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: Colors.grey.shade300,
                    ),
                  ),
              ],
            ),
          ),
          Expanded(
            child: Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Text(
                        time,
                        style: const TextStyle(
                          color: primaryColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    address,
                    style: TextStyle(color: Colors.grey.shade600),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    completed ? 'Đã hoàn thành' : 'Chưa đến điểm dừng',
                    style: TextStyle(
                      fontSize: 12,
                      color: completed ? Colors.green : Colors.orange,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
